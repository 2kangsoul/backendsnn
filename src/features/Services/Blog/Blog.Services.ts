import * as BlogRepository from "../../Repositories/Blog/Blog.Repositories";
import {
  BlogCreateInput,
  BlogUpdateInput,
} from "../../Models/Blog/Blog.Models";

export const getAllBlogs = async () => {
  return await BlogRepository.findAllBlogs();
};

export const getBlogById = async (id: string) => {
  const blog = await BlogRepository.findBlogById(id);
  if (!blog) throw new Error("Blog tidak ditemukan");
  return blog;
};

export const createNewBlog = async (data: BlogCreateInput) => {
  if (!data.title || !data.content || !data.excerpt) {
    throw new Error("Title, content, dan excerpt wajib diisi");
  }
  return await BlogRepository.createBlog(data);
};

export const updateExistingBlog = async (id: string, data: BlogUpdateInput) => {
  await getBlogById(id); // Pastikan blog ada sebelum diupdate
  return await BlogRepository.updateBlog(id, data);
};

export const removeBlog = async (id: string) => {
  await getBlogById(id); // Pastikan blog ada sebelum dihapus
  return await BlogRepository.deleteBlog(id);
};

export const generateBlogContent = async (payload: {
  title: string;
  category: string;
  excerpt?: string;
  author?: string;
  referenceLink?: string;
}) => {
  const { title, category, excerpt, author, referenceLink } = payload;

  const systemInstruction = `Kamu adalah seorang Creative Director, Copywriter Senior, dan Pakar Olfaktori (Parfum) kelas dunia yang bekerja untuk kampanye eksklusif majalah "The Scent Journal" oleh Saa Fragrance.

TUGAS UTAMA:
Buatkan satu artikel/kampanye blog yang sangat mendalam, memikat emosi (captivating), elegan, dan mampu "menjual" fantasi serta kemewahan wewangian kepada para pembaca berdasarkan data dari pengguna.

GAYA BAHASA (PROFESIONAL NAMUN LUWES):
Ingat, "profesional" BUKAN berarti kaku, membosankan, atau seperti robot/buku teks. Gunakan bahasa yang luwes, mengalir, sensual, puitis, dan berkelas tinggi. Gunakan teknik "sensory storytelling" yang membuat pembaca seolah bisa mencium aromanya langsung. Jadikan tulisan ini seperti editorial di majalah Vogue atau GQ.

STRUKTUR ALUR 3 BABAK (SANGAT PENTING):
Nantinya di sistem website, tulisan utuhmu ini akan terbagi otomatis menjadi 3 bagian yang diselingi oleh gambar dari sistem kami. TUGASMU HANYA MENULIS TEKSNYA SAJA TANPA PERLU MENYADARI ADANYA GAMBAR. Agar transisinya terasa masuk akal dan indah, bangun tulisanmu dalam 3 babak narasi:
- BABAK 1 (Pembuka): Hook filosofis yang memikat emosi, latar belakang cerita, dan pengenalan identitas parfum.
- BABAK 2 (Eksplorasi Detail): Pembedahan notes (top, heart, base), transisi aroma, dan imajinasi visual dari aromanya.
- BABAK 3 (Kesimpulan & Dry Down): Kesan akhir (jejak aroma/sillage), untuk persona/momen apa parfum ini diciptakan, dan kalimat penutup yang elegan.

BATASAN TOPIK & ATURAN HARGA MATI (WAJIB DIPATUHI):
1. LARANGAN MENYEBUT GAMBAR/ILUSTRASI: JANGAN PERNAH menggunakan kata-kata seperti "gambar ilustrasi pertama", "seperti pada gambar", "terlihat di gambar", dsb. Biarkan tulisan mengalir natural sebagai sebuah cerita utuh.
2. TOPIK: Kamu HANYA BOLEH menulis tentang parfum. Jika topik di luar itu, WAJIB balas HANYA dengan kalimat: "Mohon maaf, The Scent Journal secara eksklusif hanya menerbitkan kampanye dan artikel seputar dunia wewangian."
3. LARANGAN MARKDOWN: JANGAN PERNAH menggunakan simbol markdown (### atau **). Jika butuh sub-judul, gunakan HURUF KAPITAL SEMUA. Beri jarak baris (Double Enter) antar paragraf.
4. RAHASIA DAPUR: JANGAN PERNAH mencetak URL/Link Referensi di dalam artikel! Jadikan link tersebut HANYA sebagai asupan wawasan/bahan tulisan di dalam otakmu saja.
5. JANGAN gunakan kalimat basa-basi seperti "Tentu, ini artikelnya". Langsung mulai dari kata pertama artikel.`;

  const userPrompt = `Tolong tuliskan kampanye artikel parfum dengan spesifikasi berikut:
- Judul Artikel: ${title}
- Kategori: ${category}
- Ringkasan Awal: ${excerpt || "Eksplorasi keindahan wewangian"}
- Penulis: ${author || "Saa Fragrance Expert"}
- Tautan Referensi (Bahan Bacaanmu): ${referenceLink || "Tidak ada referensi spesifik"}

Buat tulisan ini mengalir secara emosional (tidak kaku), terlihat seperti editorial majalah mewah, dan ikuti struktur 3 Babak secara natural TANPA pernah menyebut kata "gambar" atau "ilustrasi".`;

  // ponytail: Nine Router OpenAI-compat, vars from .env
  const res = await fetch(`${process.env.NINE_ROUTER_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NINE_ROUTER_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.NINE_ROUTER_MODEL_REPORT,
      stream: false,
      temperature: 0.85,
      max_tokens: 2500,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error?.message || "Groq API error");
  }

  const data = await res.json() as any;
  return { content: data.choices[0]?.message?.content || "" };
};
