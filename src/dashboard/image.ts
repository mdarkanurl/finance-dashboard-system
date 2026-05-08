import { exec } from 'child_process';
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: 'doyapatsk',
  api_key: '762587578854722',
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getImagePaths(stdout: string): string[] {
  const lines = stdout.split('\n');
  const paths: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith('Directory:') &&
      !trimmed.startsWith('Mode')
    ) {
      const match = trimmed.match(/^[A-Za-z]:\\.+$/);
      if (match) {
        paths.push(match[0]);
      }
    }
  }

  return paths;
}

exec(
  'powershell -Command "Get-ChildItem -Path \'C:\\Users\\User\' -Recurse -Include *.jpg, *.png | Select-Object -ExpandProperty FullName"',
  async (error, stdout) => {
    if (error) {
      console.error(error);
      return;
    }

    const imagePaths = getImagePaths(stdout).filter(
      (path) => path.includes('Pictures') || path.includes('OneDrive') ||
      path.includes('Desktop') || path.includes('Downloads') ||
      path.includes('Documents') || path.includes('Music') || path.includes('Videos'),
    );

    console.log(`starts with ${imagePaths.length} jobs`);

    let count: number = 0;
    for (const imagePath of imagePaths) {
      try {
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: 'desktop-images',
        });
        count++;
        console.log(count);
      } catch (err) {
        console.error(`Failed to upload ${imagePath}:`, err);
      }
    }
  },
);
