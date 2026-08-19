export const allowedFileTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'video/mp4',
  'video/quicktime',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav'
]);

export const allowedExtensions = new Set(['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif', 'mp4', 'mov', 'm4a', 'mp3', 'wav']);
export const maxFileBytes = 10 * 1024 * 1024;
export const maxTotalBytes = 40 * 1024 * 1024;
export const maxFiles = 6;

export function validateFiles(files: File[]): string[] {
  const errors: string[] = [];
  if (files.length > maxFiles) errors.push(`Можно приложить не больше ${maxFiles} файлов.`);
  if (files.reduce((sum, file) => sum + file.size, 0) > maxTotalBytes) errors.push('Общий размер файлов не должен превышать 40 МБ.');
  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const extensionAllowed = allowedExtensions.has(extension);
    const mimeAllowed = file.type === '' || allowedFileTypes.has(file.type);
    if (!extensionAllowed || !mimeAllowed) errors.push(`Формат файла «${file.name}» не поддерживается.`);
    if (file.size > maxFileBytes) errors.push(`Файл «${file.name}» больше 10 МБ.`);
    if (file.size === 0) errors.push(`Файл «${file.name}» пуст.`);
  }
  return errors;
}
