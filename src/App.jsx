'use client'
import React, {useEffect, useState} from 'react'
import HowItWorks from "../sections/HowItWorks.jsx";

function App() {
    return (<>
        <Layout>
            <HowItWorks/>
        </Layout>
    </>)
}

export default App

const Layout = ({children}) => {
    const [activeSection, setActiveSection] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const handleScroll = (e) => {
            if (isScrolling) return;

            setIsScrolling(true);
            setTimeout(() => setIsScrolling(false), 1000);

            if (e.deltaY > 0 && activeSection < children.length - 1) {
                setActiveSection(prev => prev + 1);
            } else if (e.deltaY < 0 && activeSection > 0) {
                setActiveSection(prev => prev - 1);
            }
        };

        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [activeSection, children.length, isScrolling]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {React.Children.map(children, (child, index) => (
                <div
                    className="absolute w-screen h-screen transition-all duration-1000 ease-in-out"
                    style={{
                        transform: `translateY(${(index - activeSection) * 100}vh)`,
                        opacity: Math.abs(index - activeSection) <= 1 ? 1 : 0,
                    }}
                >
                    <div className="w-full h-full">
                        <section className="px-26 h-screen">
                            <div className="border-l border-gray-400 px-6 h-full flex items-center">
                                {child}
                            </div>
                        </section>
                    </div>
                </div>
            ))}

            {/* Navigation dots */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                {React.Children.map(children, (_, index) => (
                    <button
                        onClick={() => setActiveSection(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === activeSection
                                ? 'bg-black w-4 h-4'
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to section ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
