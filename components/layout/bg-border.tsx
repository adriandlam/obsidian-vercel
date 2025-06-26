export default function BgBorder() {
	return (
		<>
			{/* Vertical borders */}
			<div className="absolute left-[5%] md:left-[20%] top-0 h-full border-l border-dashed" />
			<div className="absolute right-[5%] md:right-[20%] top-0 h-full border-l border-dashed" />

			{/* Horizontal borders */}
			<div className="absolute top-[10%] md:top-[15%] left-0 w-full border-t border-dashed" />
			<div className="absolute bottom-[10%] md:bottom-[15%] left-0 w-full border-t border-dashed" />

			{/* Crosses at intersections */}
			{/* Top-left intersection */}
			<div className="absolute left-[5%] top-[10%] md:left-[20%] md:top-[15%] w-4 h-[2px] bg-primary rounded-sm" />
			<div className="absolute left-[5%] top-[10%] md:left-[20%] md:top-[15%] w-[2px] h-4 bg-primary rounded-sm" />

			{/* Top-right intersection */}
			<div className="absolute right-[5%] top-[10%] md:right-[20%] md:top-[15%] w-4 h-[2px] bg-primary rounded-sm" />
			<div className="absolute right-[5%] top-[10%] md:right-[20%] md:top-[15%] w-[2px] h-4 bg-primary rounded-sm" />

			{/* Bottom-left intersection */}
			<div className="absolute left-[5%] bottom-[10%] md:left-[20%] md:bottom-[15%] w-4 h-[2px] bg-primary rounded-sm" />
			<div className="absolute left-[5%] bottom-[10%] md:left-[20%] md:bottom-[15%] w-[2px] h-4 bg-primary rounded-sm" />

			{/* Bottom-right intersection */}
			<div className="absolute right-[5%] bottom-[10%] md:right-[20%] md:bottom-[15%] w-4 h-[2px] bg-primary rounded-sm" />
			<div className="absolute right-[5%] bottom-[10%] md:right-[20%] md:bottom-[15%] w-[2px] h-4 bg-primary rounded-sm" />
		</>
	);
}
