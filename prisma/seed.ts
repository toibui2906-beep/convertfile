import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultAdminEmail = 'admin@123';
  const defaultPassword = '123456'; // Mật khẩu mặc định

  // Hash mật khẩu với bcrypt (10 rounds)
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // Thêm hoặc cập nhật (upsert) tài khoản Admin
  const admin = await prisma.user.upsert({
    where: { email: defaultAdminEmail },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      email: defaultAdminEmail,
      password: hashedPassword,
      fullName: 'Quản Trị Viên Hệ Thống',
      department: 'Phòng Công Nghệ Thông Tin',
      role: Role.ADMIN,
    },
  });

  console.log('✅ Đã khởi tạo tài khoản Admin thành công:');
  console.log(`- Email / Tài khoản: ${admin.email}`);
  console.log(`- Mật khẩu mặc định: ${defaultPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi khởi tạo tài khoản Admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });