import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = '123456'; // Mật khẩu chung mặc định
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // 1. Khởi tạo tài khoản Admin
  const defaultAdminEmail = 'admin@123';
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

  // 2. Danh sách nhân viên (STAFF) lấy từ bảng dữ liệu của bạn
  const staffList = [
    { email: 'Saonn', fullName: 'Nguyễn Ngọc Sao', department: 'Khoa cấp cứu' }, // Cắt ngắn từ ảnh hiển thị, bạn có thể chỉnh lại email đầy đủ nếu cần (@domain.com)
    { email: 'Haltn5', fullName: 'Lưu Thị Ngọc Hà', department: 'Khoa cấp cứu' },
    { email: 'Chaudtm2', fullName: 'Dương Thị Minh Châu', department: 'Khoa cấp cứu' },
    { email: 'Tutv', fullName: 'Trần Văn Tú', department: 'Khoa cấp cứu' },
    { email: 'Longdv1', fullName: 'Đỗ Viết Long', department: 'Khoa cấp cứu' },
    { email: 'Giangttn', fullName: 'Tạ Thị Nguyên Giang', department: 'Khoa cấp cứu' },
    { email: 'Huent98', fullName: 'Ngô Thị Huệ', department: 'Khoa cấp cứu' },
    { email: 'Thanhdtp5', fullName: 'Dương Thị Phương Thanh', department: 'Khoa cấp cứu' },
    { email: 'Thoavtk4', fullName: 'Vũ Thị Kim Thoa', department: 'Khoa cấp cứu' },
    { email: 'Duongnd', fullName: 'Ngô Đại Dương', department: 'Khoa cấp cứu' },
    { email: 'Phongnp', fullName: 'Nguyễn Phúc Phóng', department: 'Khoa cấp cứu' },
    { email: 'Thunt77', fullName: 'Nguyễn Thị Thu A', department: 'Khoa cấp cứu' },
    { email: 'Trangtl2', fullName: 'Trần Linh Trang', department: 'Khoa cấp cứu' },
    { email: 'Uyennt29', fullName: 'Nguyễn Thị Thu Uyên', department: 'Khoa cấp cứu' },
    { email: 'Baohq1', fullName: 'Hoàng Gia Bảo', department: 'Khoa cấp cứu' },
    { email: 'Thaovv', fullName: 'Vũ Văn Thảo', department: 'Khoa cấp cứu' },
    { email: 'Namnt2', fullName: 'Nguyễn Thanh Nam', department: 'Khoa cấp cứu' },
    { email: 'Trinhnt9', fullName: 'Ngô Thị Trinh', department: 'Khoa cấp cứu' },
    { email: 'Huyenvt23', fullName: 'Vũ Thị Huyền', department: 'Khoa cấp cứu' },
    { email: 'Uyennt11', fullName: 'Nguyễn Thu Uyên', department: 'Khoa cấp cứu' },
    { email: 'Quynt28', fullName: 'Nguyễn Trọng Quý', department: 'Khoa cấp cứu' },
    { email: 'Huongntt62', fullName: 'Nguyễn Thị Thu Hương', department: 'Khoa cấp cứu' },
    { email: 'Chuyenmv', fullName: 'Mai Văn Chuyên', department: 'Khoa cấp cứu' },
    { email: 'Vietht', fullName: 'Hồ Tuấn Việt', department: 'Khoa cấp cứu' },
    { email: 'Hongnt64', fullName: 'Nguyễn Thị Hồng', department: 'Khoa cấp cứu' },
    { email: 'Linhltt42', fullName: 'Lê Thị Thùy Linh', department: 'Khoa cấp cứu' },
    { email: 'Thanhnt252', fullName: 'Nguyễn Tiến Thành', department: 'Khoa cấp cứu' },
  ];

  console.log('🔄 Đang tiến hành seed dữ liệu nhân viên...');

  // 3. Tiến hành upsert danh sách Staff
  for (const staff of staffList) {
    await prisma.user.upsert({
      where: { email: staff.email },
      update: {
        password: hashedPassword,
        fullName: staff.fullName,
        department: staff.department,
        role: Role.STAFF,
      },
      create: {
        email: staff.email,
        password: hashedPassword,
        fullName: staff.fullName,
        department: staff.department,
        role: Role.STAFF,
      },
    });
  }

  console.log(`✅ Đã seed thành công ${staffList.length} tài khoản nhân viên (STAFF)!`);
  console.log(`🔑 Mật khẩu chung cho tất cả các tài khoản là: ${defaultPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });