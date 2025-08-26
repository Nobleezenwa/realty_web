import { ReactNode } from 'react'

export default function Section({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
    return (
        <section id={id} className={`py-16 sm:py-24 ${className ?? ''}`}>
            <div className="container">{children}</div>
        </section>
    )
}