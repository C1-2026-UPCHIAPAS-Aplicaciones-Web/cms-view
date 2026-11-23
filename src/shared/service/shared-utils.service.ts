export const sharedUtilsService = {
  uid(prefix = 'id'): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
  },

  clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  },

  formatNumber(value: number): string {
    return Math.round(value).toLocaleString('es-MX');
  },

  slugify(raw: string): string {
    return (
      (raw || 'articulo-sin-titulo')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 72) || 'articulo'
    );
  },

  downloadFile(content: string, filename: string, mimeType = 'text/plain;charset=utf-8'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },

  async copyText(content: string): Promise<boolean> {
    if (!navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch {
      return false;
    }
  },

  readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
      reader.readAsDataURL(file);
    });
  },
};
