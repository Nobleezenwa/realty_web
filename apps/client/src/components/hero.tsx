import Image from 'next/image'
import Section from './section'


export default function Hero() {
    return (
        <Section className="pt-12" id="hero">
            <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Find a place you’ll love to live
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Search thousands of listings, compare neighborhoods, and schedule tours with trusted agents.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <a href="#listings" className="btn btn-primary">Explore Listings</a>
                        <a href="#contact" className="btn btn-ghost">Contact an Agent</a>
                    </div>
                </div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-soft">
                    <Image src="/hero.jpg" alt="Beautiful modern home" fill priority className="object-cover" />
                </div>
            </div>
        </Section>
    )
}