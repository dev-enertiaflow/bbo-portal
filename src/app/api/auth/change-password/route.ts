import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Valid user ID and new password (minimum 6 characters) required." },
        { status: 400 }
      );
    }

    // Retrieve existing metadata to preserve name, role, mlsId, etc.
    const { data: userRes, error: getErr } = await supabaseAdmin.auth.admin.getUserById(userId);
    const existingMeta = userRes?.user?.user_metadata || {};

    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
      user_metadata: {
        ...existingMeta,
        mustChangePassword: false,
      },
    });

    if (updateErr) {
      console.error("Error updating password in Supabase:", updateErr);
      return NextResponse.json({ success: false, message: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. Private credentials activated.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
