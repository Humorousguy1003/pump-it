interface ArrowTopRightProps {
    className?: string;
}

const ArrowTopRight = ({ className }: ArrowTopRightProps) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.75 3.75C6.33579 3.75 6 3.41421 6 3C6 2.58579 6.33579 2.25 6.75 2.25H15C15.4142 2.25 15.75 2.58579 15.75 3V11.25C15.75 11.6642 15.4142 12 15 12C14.5858 12 14.25 11.6642 14.25 11.25V4.81066L3.53033 15.5303C3.23744 15.8232 2.76256 15.8232 2.46967 15.5303C2.17678 15.2374 2.17678 14.7626 2.46967 14.4697L13.1893 3.75H6.75Z"
                fill="white"
            />
        </svg>
    );
};

export default ArrowTopRight;
