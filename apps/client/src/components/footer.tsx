import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t border-gray-100">
            <div className="container py-12 grid gap-8 md:grid-cols-3">
                <div>
                    <h3 className="font-semibold">Homeverse</h3>
                    <p className="mt-2 text-gray-600">Find your dream home with our curated listings and expert agents.</p>
                </div>
                <div>
                    <h4 className="font-medium">Company</h4>
                    <ul className="mt-3 space-y-2 text-gray-600">
                        <li><Link href="#about">About</Link></li>
                        <li><Link href="#features">Features</Link></li>
                        <li><Link href="#contact">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium">Get updates</h4>
                    <form className="mt-3 flex gap-2">
                        <input type="email" placeholder="Email address" className="flex-1 rounded-xl border border-gray-200 px-4 py-3" />
                        <button className="btn btn-primary" type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
            <div className="border-t border-gray-100 py-6 text-center text-sm text-gray-600">© {new Date().getFullYear()} Homeverse. All rights reserved.</div>
        </footer>
    )
}