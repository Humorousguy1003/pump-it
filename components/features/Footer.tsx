import ALink from './ALink';

/* eslint-disable @next/next/no-img-element */
const Footer = () => {
    return (
        <div className="py-16 bg-black">
            <div className="flex flex-col items-center justify-center gap-12 xl:container container max-w-full py-1">
                <img
                    src="/footer-logo.svg"
                    alt="logo"
                    width={207}
                    height={60}
                />
                <div className="flex  flex-wrap items-center justify-center gap-8 text-white">
                    <ALink
                        href="/"
                        className="text-white text-base font-semibold"
                    >
                        Home
                    </ALink>
                    <span>/</span>
                    <ALink
                        href="/explore/grid"
                        className="text-white text-base font-semibold"
                    >
                        Explore
                    </ALink>
                    <span>/</span>
                    <ALink
                        href="/"
                        className="text-white text-base font-semibold"
                    >
                        Stats
                    </ALink>
                    <span>/</span>
                    <ALink
                        href="/"
                        className="text-white text-base font-semibold"
                    >
                        Resources
                    </ALink>
                    <span>/</span>
                    <ALink
                        href="/projects/create"
                        className="text-white text-base font-semibold"
                    >
                        Create
                    </ALink>
                </div>
                <div className="flex  flex-wrap items-center justify-center gap-3">
                    <a
                        href="https://www.instagram.com"
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <img
                            src="/instagram.svg"
                            alt="icon"
                            width={20}
                            height={20}
                        />
                    </a>
                    <a
                        href="https://twitter.com"
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <img
                            src="/twitter.svg"
                            alt="icon"
                            width={20}
                            height={20}
                        />
                    </a>
                    <a
                        href="https://discord.gg"
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <img
                            src="/discord.svg"
                            alt="icon"
                            width={20}
                            height={20}
                        />
                    </a>
                    <a
                        href="https://telegram.org"
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <img
                            src="/telegram.svg"
                            alt="icon"
                            width={20}
                            height={20}
                        />
                    </a>
                    <a
                        href="https://www.mail.com"
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <img
                            src="/mail.svg"
                            alt="icon"
                            width={20}
                            height={20}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
