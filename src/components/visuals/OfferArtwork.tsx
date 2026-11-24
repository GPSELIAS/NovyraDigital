export default function OfferArtwork() {
  return (
    <div aria-hidden="true" className="relative isolate hidden min-h-51 bg-[radial-gradient(ellipse_at_56%_52%,#243462_0%,#111827_41%,transparent_73%)] md:block">
      <div className="bg-grid absolute -inset-3 -z-10 [mask-image:radial-gradient(ellipse,black_14%,transparent_70%)]" />
      <div className="absolute inset-[21px_19%_24px_10%] overflow-hidden rounded-xl border border-[#7588b6]/40 bg-[#141925] shadow-[0_22px_48px_#0008] [transform:perspective(880px)_rotateY(-9deg)_rotateZ(-6deg)]">
        <div className="flex items-center gap-1 border-b border-accent-soft/15 px-3 py-2.5">
          <span className="size-1 rounded-full bg-[#8897bf]" />
          <span className="size-1 rounded-full bg-[#8897bf]" />
          <span className="size-1 rounded-full bg-[#8897bf]" />
          <span className="mx-auto h-1.5 w-1/2 rounded-full bg-[#2b344d]" />
        </div>
        <div className="grid grid-cols-3 gap-2.5 p-3">
          <div className="col-span-2 space-y-1.5 py-1.5">
            <div className="h-2 w-4/5 rounded-full bg-[#dce4fa]" />
            <div className="h-1 w-3/5 rounded-full bg-[#98a9d1]" />
            <div className="h-1 w-5/6 rounded-full bg-[#5b6687]" />
            <div className="mt-2.5 h-2.5 w-12 rounded-full bg-accent" />
          </div>
          <div className="rounded-md border border-accent-soft/20 bg-[radial-gradient(ellipse_at_75%_28%,#b8a9f6_0%,#6b85ee_21%,transparent_62%),linear-gradient(145deg,#202c52,#3153a8)]" />
          {[0, 1, 2].map((tile) => (
            <div key={tile} className="h-7 rounded-md border border-accent-soft/15 bg-[#222b40]/40 p-2">
              <div className="h-[3px] w-1/3 rounded-full bg-[#8194bf] shadow-[0_6px_#445372]" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-[51px] right-[10%] bottom-1.5 w-[73px] rotate-11 overflow-hidden rounded-[14px] border border-[#7588b6]/40 bg-[#141925] p-2 shadow-[0_22px_48px_#0008]">
        <div className="mx-auto mb-2.5 h-[3px] w-[18px] rounded-full bg-[#65769f]" />
        <div className="h-12 rounded-md border border-accent-soft/20 bg-[radial-gradient(ellipse_at_75%_28%,#b8a9f6_0%,#6b85ee_21%,transparent_62%),linear-gradient(145deg,#202c52,#3153a8)]" />
        <div className="mt-2.5 h-1 rounded-full bg-[#98a9d1]" />
        <div className="mt-1 h-1 w-2/3 rounded-full bg-[#5b6687]" />
        <div className="mt-2.5 h-2 w-7 rounded-full bg-accent" />
      </div>
    </div>
  )
}
