import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-serif font-bold text-stone-800 mb-12 text-center tracking-tight">
                    Over Monique Maakt
                </h1>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 md:p-12 space-y-10">
                    <section>
                        <div className="flex items-center gap-5 mb-6">
                            <div className="bg-stone-100 p-4 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-serif font-semibold text-stone-800">Uniek & Handgemaakt</h2>
                        </div>
                        <p className="text-stone-600 leading-relaxed text-lg font-light">
                            Elk sieraad in onze collectie is met liefde en aandacht voor detail met de hand gemaakt.
                            Bij Monique Maakt geloven we dat ware schoonheid zit in unieke imperfecties en persoonlijk vakmanschap.
                            Geen twee items zijn precies hetzelfde, waardoor je altijd een uniek exemplaar draagt dat speciaal voor jou is gecreëerd.
                        </p>
                    </section>

                    <div className="border-t border-stone-100"></div>

                    <section>
                        <div className="flex items-center gap-5 mb-6">
                            <div className="bg-stone-100 p-4 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-serif font-semibold text-stone-800">Duurzaam & Ecologisch</h2>
                        </div>
                        <p className="text-stone-600 leading-relaxed text-lg font-light">
                            We geven om onze planeet. Daarom kiezen we bewust voor duurzame materialen en milieuvriendelijke productieprocessen.
                            Onze verpakkingen zijn plasticvrij en we streven ernaar om onze ecologische voetafdruk zo klein mogelijk te houden.
                            Kiezen voor Monique Maakt is kiezen voor stijl met een goed geweten.
                        </p>
                    </section>

                    <div className="pt-8 text-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-primary hover:bg-primary-hover transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            Bekijk onze collectie
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
