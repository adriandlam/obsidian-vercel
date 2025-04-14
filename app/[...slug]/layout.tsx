import Footer from "@/components/layout/Footer";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="p-5 mx-auto w-full max-w-5xl">
			<div className="pt-10 pb-4">{children}</div>
			<Footer />
		</div>
	);
}
