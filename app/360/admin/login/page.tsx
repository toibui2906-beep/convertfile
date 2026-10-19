import { redirect } from 'next/navigation';

export default function AdminLoginPage() {
  redirect('/360?openLoginModal=true');
}