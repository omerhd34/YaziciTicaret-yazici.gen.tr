import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAdminAuthenticated } from '@/lib/adminSession';

export async function GET() {
 try {
  const cookieStore = await cookies();
  const authenticated = isAdminAuthenticated(cookieStore);

  return NextResponse.json({
   success: true,
   authenticated
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, authenticated: false },
   { status: 500 }
  );
 }
}