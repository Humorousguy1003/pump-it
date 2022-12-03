import Link from 'next/link';
import { memo } from 'react';

interface AlinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    style?: any;
    onClick?: () => void;
}

const Alink: React.FC<AlinkProps> = ({
    href,
    children,
    className,
    onClick,
    style,
}) => {
    /**
     * On click handler
     *
     * @param {MouseEvent} e
     */
    function onClickHandler(event: React.MouseEvent<HTMLElement>): void {
        if (href == '#') {
            event.preventDefault();
        }

        if (typeof onClick == 'function') {
            onClick();
        }
    }

    return (
        <Link href={href}>
            <a
                className={className}
                onClick={onClickHandler}
                style={style ? style : {}}
            >
                {children}
            </a>
        </Link>
    );
};

export default memo(Alink);
