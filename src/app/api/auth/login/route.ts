import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    // Isolated auth client to verify password without polluting the global supabaseAdmin service_role
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password || "BrokerPass2026!";

    // Attempt sign in via isolated client
    const { data, error } = await authClient.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass,
    });

    if (error) {
      // If user not in Supabase Auth yet, check if authorized Mercer Group staff and provision via Admin API
      if (cleanEmail.includes("@themercergroup.com") || cleanEmail === "paul@themercergroup.com") {
        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: cleanPass,
          email_confirm: true,
          user_metadata: {
            name: cleanEmail.startsWith("paul") ? "Paul Mercer" : "Licensed Associate",
            role: cleanEmail.startsWith("paul") ? "Managing Broker and Team Principal" : "Licensed Associate",
            mlsId: cleanEmail.startsWith("paul") ? "MFR261510833" : "MFR" + Math.floor(261500000 + Math.random() * 90000),
            officeId: "MFR771620",
          },
        });

        if (newUser?.user) {
          return NextResponse.json({
            success: true,
            user: {
              id: newUser.user.id,
              name: newUser.user.user_metadata?.name || "Licensed Agent",
              email: newUser.user.email,
              role: newUser.user.user_metadata?.role || "Licensed Associate",
              mlsId: newUser.user.user_metadata?.mlsId || "MFR261510833",
              officeId: "MFR771620",
            },
          });
        }
      }

      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    }

    const u = data.user;
    return NextResponse.json({
      success: true,
      user: {
        id: u.id,
        name: u.user_metadata?.name || "Paul Mercer",
        email: u.email,
        role: u.user_metadata?.role || "Managing Broker and Team Principal",
        mlsId: u.user_metadata?.mlsId || "MFR261510833",
        officeId: u.user_metadata?.officeId || "MFR771620",
        mustChangePassword: Boolean(u.user_metadata?.mustChangePassword),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
