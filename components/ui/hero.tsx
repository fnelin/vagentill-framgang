import Link from "next/link";

export default function HeroArea() {
    return <div className="bg-blue-500 text-gray-50 text-center">
        <div className="py-20">
            <h1 className="font-semibold text-5xl">
                Vägen till framgång
            </h1>
            <p className="my-4">
                Hitta ditt drömjobb och inspireras av andra
            </p>
            <Link href="https://www.linkedin.com" target="_blank" className="btn">
                Gå till LinkedIn
            </Link>

        </div>
    </div>
}