/* eslint-disable @next/next/no-img-element */
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import ALink from './ALink';

import { Project } from '~/types/projects';
import { chainList } from '~/utils/constants';
import ArrowTopRight from './icons/ArrowTopRight';
import { getProjectStatus, getTimeDiff } from '~/utils';
import { useWeb3 } from '~/utils/web3';
import { ethers } from 'ethers';
import { launchpadAbi } from '~/utils/abis';
import { toggleFavoriteProject } from '~/api/projects';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

interface ProjectGridItemProps {
    project: Project;
    showInvested?: boolean;
}

const ProjectGridItem = ({
    project,
    showInvested = false,
}: ProjectGridItemProps) => {
    const [saleEnd, setSaleEnd] = useState<string | null>(null);
    const { data: session, status } = useSession();
    const { signer, address } = useWeb3();
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [depositedAmount, setDepositedAmount] = useState(0);

    const chain = chainList.find((item) => item.id == project.chain_id);
    const percent = useMemo(() => {
        return Math.round(totalDeposits / Number(project.soft_cap));
    }, [project.soft_cap, totalDeposits]);

    const startDate =
        new Date(project.start_date as string) > new Date()
            ? project.start_date
            : project.end_date;
    const [isFavorite, setIsFavorite] = useState(
        project.favorite_users?.find((u) => u.email === session?.user?.email)
    );

    useEffect(() => {
        if (new Date(startDate as string) > new Date()) {
            setInterval(() => {
                const { days, hours, minutes, seconds } = getTimeDiff(
                    startDate as string
                );
                setSaleEnd(days + ':' + hours + ':' + minutes + ':' + seconds);
            }, 1000);
        }
    }, [startDate]);

    const tokens = () => {
        if (
            project?.tokenAddress ===
            '0x0000000000000000000000000000000000000000'
        ) {
            if (project?.chain_id == 56) {
                return 'BNB';
            } else {
                return 'ETH';
            }
        } else {
            if (project?.chain_id == 56) {
                return 'BUSD';
            } else {
                return 'USDT';
            }
        }
    };

    const toggleFavorite = async () => {
        const res = await toggleFavoriteProject({ project_id: project.id });
        if (res.status == 'added') {
            setIsFavorite(true);
            toast.success('Project is added to the favorite list');
        } else if (res.status == 'deleted') {
            setIsFavorite(false);
            toast.warning('Project is removed from the favorite list');
        }
    };

    useEffect(() => {
        if (signer) {
            const contractInstance = new ethers.Contract(
                project.contractAddress,
                launchpadAbi.abi,
                signer
            );

            contractInstance.totalDeposits().then((res: string) => {
                setTotalDeposits(Number(ethers.utils.formatUnits(res, 18)));
            });

            contractInstance.depositedAmount(address).then((res: string) => {
                setDepositedAmount(Number(ethers.utils.formatUnits(res, 18)));
            });
        }
    }, [signer]);

    return (
        <div className="rounded-3xl overflow-hidden border border-veryLight">
            <div className="relative z-10">
                {project.banner ? (
                    <img
                        src={
                            process.env.NEXT_PUBLIC_BACKEND_URL +
                            '/storage/' +
                            project.banner
                        }
                        alt="nft"
                        className="object-cover h-[200px] w-full"
                    />
                ) : (
                    <div className="h-[200px] bg-gray-400"></div>
                )}
                <div className="absolute bottom-0 translate-y-1/2 left-6 rounded-xl overflow-hidden h-20 w-20">
                    <img
                        src={
                            process.env.NEXT_PUBLIC_BACKEND_URL +
                            '/storage/' +
                            project.logo
                        }
                        alt="user"
                        className="w-100 object-cover"
                    />
                </div>
                <div className="absolute top-4 right-4">
                    <div className="border border-veryLight font-semibold px-3 py-1 5 text-sm bg-white">
                        {getProjectStatus(project)}
                    </div>
                </div>
                {status === 'authenticated' && (
                    <button
                        className="absolute bottom-4 right-4 w-9 h-9 flex items-center justify-center rounded-full border border-red"
                        onClick={toggleFavorite}
                    >
                        <span
                            className={`${
                                isFavorite ? 'text-red' : 'text-white'
                            }`}
                        >
                            <FontAwesomeIcon icon={faHeart} size="lg" />
                        </span>
                    </button>
                )}
            </div>
            <div className="relative">
                {saleEnd && (
                    <div className="absolute left-24 right-0 top-0 flex justify-between text-xs font-semibold px-2 pl-4 py-1.5 bg-[#FDF7F0] text-[#D99718]">
                        <span>
                            {getProjectStatus(project) === 'Coming Soon'
                                ? 'Sale starts in'
                                : 'Sale ends in'}{' '}
                        </span>
                        <span>{saleEnd}</span>
                    </div>
                )}
            </div>
            <div className="px-6">
                <div className="flex justify-between items-center mt-16 pt-2 mb-6">
                    <ALink
                        href={`/projects/${project.id}`}
                        className="font-semibold text-xl"
                    >
                        {project.name}
                    </ALink>
                    <span>
                        <img
                            src={chain?.image}
                            className="ml-auto"
                            alt="chain"
                            width={40}
                            height={40}
                        />
                    </span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                    <span>Progress:</span>
                    <span>{percent}%</span>
                </div>
                <div
                    className="relative rounded-full h-1.5 overflow-hidden mb-3"
                    style={{ backgroundColor: '#F4F6FB' }}
                >
                    <div
                        className="absolute top-0 left-0 bottom-0 bg-red"
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-sm font-semibold mb-8">
                    <span>
                        {totalDeposits.toLocaleString('en')} {tokens()}
                    </span>
                    {Number(project.soft_cap).toLocaleString('en')} {tokens()}
                </div>
                {showInvested && (
                    <div className="flex justify-between text-sm font-semibold mb-8">
                        <span>Invested amount</span>
                        {depositedAmount.toLocaleString('en')} {tokens()}
                    </div>
                )}
            </div>
            <ALink
                href={`/projects/${project.id}`}
                className="flex bg-black text-white justify-center py-4 gap-3"
            >
                <span>Learn More</span>
                <ArrowTopRight />
            </ALink>
        </div>
    );
};

export default ProjectGridItem;
