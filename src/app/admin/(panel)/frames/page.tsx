import { FramesManager } from "@/components/admin/frames-manager";
import { getFrames } from "@/lib/queries";

export default async function AdminFramesPage() {
  const frames = await getFrames();

  return (
    <div>
      <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
        Catalogue
      </p>
      <h1 className="mt-2 mb-8 font-serif text-4xl">Frames</h1>
      <p className="mb-8 max-w-2xl font-sans text-sm leading-7 text-muted">
        Add a frame size, color, and price. On the product page the matching
        painting size will show these frame options.
      </p>
      <FramesManager frames={frames} />
    </div>
  );
}
