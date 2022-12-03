/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { ReactElement, Suspense, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

import Fallback from '~/components/features/Fallback';
import ProjectGridItem from '~/components/features/ProjectGridItem';
import Layout from '~/components/layouts/LayoutDefault';
import { currentProjectIdState, singleProjectState } from '~/recoil/projects';
import { getProjectStatus, getProjectSymbol, getTimeDiff } from '~/utils';
import { chainList } from '~/utils/constants';
import { launchpadAbi, providers, ERC20Abi } from '~/utils/abis';

import { isLoadingState } from '~/recoil/other';
import { toast } from 'react-toastify';
import { useWeb3 } from '~/utils/web3';

const ProjectPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [currentProjectId, setCurrentProjectId] = useRecoilState(
        currentProjectIdState
    );

    useEffect(() => {
        if (id) {
            setCurrentProjectId(id as string);
        }
    }, [setCurrentProjectId, id]);

    if (!currentProjectId || currentProjectId == 'unknown') return <Fallback />;

    return (
        <Suspense fallback={<Fallback />}>
            <ProjectSection />
        </Suspense>
    );
};

const ProjectSection = () => {
    const { project, related } = useRecoilValue(singleProjectState);
    const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
    const [saleEnd, setSaleEnd] = useState<any>(null);
    const chain = chainList.find((item) => item.id == project.chain_id);
    const [web3Modal, setWeb3Modal]: [any, any] = useState();
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [amountToBuy, setAmountToBuy] = useState('0');
    const [contributors, setContributors] = useState(0);
    const { connect, address, signer, chainId } = useWeb3();

    const getProjectInfo = async () => {
        try {
            if (project && project.chain_id) {
                let id = project.chain_id.toString();
                let rpc = providers[id];
                let provider = new ethers.providers.JsonRpcProvider(rpc);
                console.log({ provider, providers, chainId: id });
                let contractInstance = new ethers.Contract(
                    project.contractAddress,
                    launchpadAbi.abi,
                    provider
                );

                let deposits = await contractInstance.totalDeposits();
                setTotalDeposits(
                    Number(ethers.utils.formatUnits(deposits, 18))
                );

                setContributors(Number(await contractInstance.contributors()));

                console.log(provider, deposits);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuy = async () => {
        setIsLoading(true);
        if (!address) {
            connect && connect();
        }
        try {
            if (
                project.tokenAddress !=
                '0x0000000000000000000000000000000000000000'
            ) {
                let ERC20 = new ethers.Contract(
                    project.tokenAddress!,
                    ERC20Abi.abi,
                    signer
                );
                let approvalAmount = await ERC20.allowance(
                    address,
                    project.contractAddress
                );

                if (
                    Number(ethers.utils.formatUnits(approvalAmount, 18)) <
                    Number(amountToBuy)
                ) {
                    try {
                        let tx = await ERC20.approve(
                            project.contractAddress,
                            ethers.constants.MaxUint256
                        );

                        await tx.wait();
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
            let contractInstance = new ethers.Contract(
                project.contractAddress,
                launchpadAbi.abi,
                signer
            );

            let amount = ethers.utils.parseUnits(amountToBuy, 18);
            let value = ethers.utils.parseUnits('0', 18);
            if (
                project.tokenAddress ===
                '0x0000000000000000000000000000000000000000'
            ) {
                value = amount;
            }

            let tx = await contractInstance.buy(amount, { value });

            let receipt = await tx.wait();

            getProjectInfo();
            console.log(receipt);
            setIsLoading(false);
            return receipt;
        } catch (error) {
            console.log(error);
            toast.error('Erros found while seding transaction');
            setIsLoading(false);
            return null;
        }
    };

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

    useEffect(() => {
        if (new Date(project.end_date as string) > new Date()) {
            setInterval(() => {
                setSaleEnd(getTimeDiff(project.end_date as string));
            }, 1000);
        }
        console.log(project, 'project');
    }, [project.end_date]);

    useEffect(() => {
        getProjectInfo();
    }, [project]);

    return (
        <div className="xl:container container max-w-full pt-10 pb-[140px]">
            <div className="pagination flex items-center gap-5 font-semibold text-sm mb-10">
                <span className="opacity-40">Explore</span>
                <span>
                    <img src="/project/arrow-right.svg" alt="arrow" />{' '}
                </span>
                <span className="uppercase">{project.name}</span>
            </div>
            {project.banner ? (
                <img
                    src={
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                        '/storage/' +
                        project.banner
                    }
                    alt="nft"
                    className="object-cover w-full"
                    style={{ minHeight: '400px' }}
                />
            ) : (
                <div
                    className="bg-gray-400"
                    style={{ minHeight: '400px' }}
                ></div>
            )}
            <div className="text-center">
                <img
                    src={
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                        '/storage/' +
                        project.logo
                    }
                    alt="user"
                    className="-translate-y-1/2 mx-auto rounded-xl max-w-[164px]"
                />
            </div>
            <h3 className="h3 text-center mb-6 uppercase -mt-4">
                {project.name}
            </h3>
            <div className="flex justify-center items-center gap-9 mb-16">
                <a href={project.website}>
                    <img src="/project/globe.svg" alt="icon" />
                </a>
                <a href={project.instagram ? project.instagram : '#'}>
                    <img src="/project/instagram.svg" alt="icon" />
                </a>
                <a href={project.twitter ? project.twitter : '#'}>
                    <img src="/project/twitter.svg" alt="icon" />
                </a>
                <a href={project.discord ? project.discord : '#'}>
                    <img src="/project/discord.svg" alt="icon" />
                </a>
                <a href={project.telegram ? project.telegram : '#'}>
                    <img src="/project/telegram.svg" alt="icon" />
                </a>
                <a href={project.medium ? project.medium : '#'}>
                    <img src="/project/medium.svg" alt="icon" />
                </a>
            </div>
            <div className="grid lg:grid-cols-7 grid-cols-1 lg:gap-10 gap-8">
                <div className="lg:col-span-4 leading-[1.6]">
                    <h5 className="text-2xl font-semibold mb-6">Description</h5>
                    <p className="text-sm mb-4 whitespace-pre-line">
                        {project.description}
                    </p>
                </div>
                <div className="lg:col-span-3">
                    <div className="p-8 rounded-xl border border-veryLight text-sm mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm">
                                {getProjectStatus(project) === 'Coming Soon'
                                    ? 'Starting'
                                    : 'Ends in'}
                                :
                            </span>
                            <span className="font-semibold text-sm text-[#59BA36]">
                                {getProjectStatus(project)}
                            </span>
                        </div>
                        {saleEnd && (
                            <div className="flex items-center justify-between flex-wrap mb-4">
                                <div className="flex flex-col items-center justify-center gap-y-1.5">
                                    <div className="w-14 h-12 flex items-center justify-center text-2xl text-white bg-black rounded-lg">
                                        {saleEnd.weeks}
                                    </div>
                                    <span className="text-xs opacity-40">
                                        Weeks
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-y-1.5">
                                    <div className="w-14 h-12 flex items-center justify-center text-2xl text-white bg-black rounded-lg">
                                        {saleEnd.days}
                                    </div>
                                    <span className="text-xs opacity-40">
                                        Days
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-y-1.5">
                                    <div className="w-14 h-12 flex items-center justify-center text-2xl text-white bg-black rounded-lg">
                                        {saleEnd.hours}
                                    </div>
                                    <span className="text-xs opacity-40">
                                        Hours
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-y-1.5">
                                    <div className="w-14 h-12 flex items-center justify-center text-2xl text-white bg-black rounded-lg">
                                        {saleEnd.minutes}
                                    </div>
                                    <span className="text-xs opacity-40">
                                        Minutes
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-y-1.5">
                                    <div className="w-14 h-12 flex items-center justify-center text-2xl text-white bg-black rounded-lg">
                                        {saleEnd.seconds}
                                    </div>
                                    <span className="text-xs opacity-40">
                                        Seconds
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center mb-4">
                            <span className="mr-auto">Raised:</span>
                            <span className="text-2xl mr-1 font-semibold text-red">
                                {Number(totalDeposits).toLocaleString('en')}
                            </span>
                            <span>{tokens()}</span>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <span>Total voters:</span>
                            <span className="font-semibold">
                                {contributors.toLocaleString('en')}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                            <span>Progress:</span>
                            <span className="font-semibold">
                                {(totalDeposits * 100) /
                                    Number(project.hard_cap)}
                                %
                            </span>
                        </div>
                        <div
                            className="relative rounded-full h-1.5 overflow-hidden mb-3"
                            style={{ backgroundColor: '#F4F6FB' }}
                        >
                            <div
                                className="absolute top-0 left-0 bottom-0 bg-red"
                                style={{
                                    width: `${
                                        (totalDeposits * 100) /
                                        Number(project.hard_cap)
                                    }%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm font-semibold mb-8">
                            <span>
                                {' '}
                                {totalDeposits.toLocaleString('en')} {tokens()}
                            </span>
                            <span>
                                {Number(project.hard_cap).toLocaleString('en')}{' '}
                                {tokens()}
                            </span>
                        </div>
                        <div className="flex items-center justify-center mb-6">
                            <input
                                type="number"
                                className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                value={amountToBuy}
                                onChange={(e) => setAmountToBuy(e.target.value)}
                            />
                        </div>

                        {address ? (
                            <button
                                disabled={
                                    address !== '' &&
                                    (Number(amountToBuy) === 0 ||
                                        chainId !== Number(project.chain_id))
                                }
                                onClick={handleBuy}
                                className="w-full rounded-full bg-red text-white py-4 font-bold"
                            >
                                {chainId !== Number(project.chain_id)
                                    ? 'Wrong Network'
                                    : 'Buy Now'}
                            </button>
                        ) : (
                            <button
                                onClick={() => connect && connect()}
                                className="w-full rounded-full bg-red text-white py-4 font-bold"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                    <div className="p-8 rounded-xl border border-veryLight text-sm mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="mr-auto">Chain:</span>
                            <span className="font-semibold mr-2">
                                {chain?.name}
                            </span>
                            <img
                                src={chain?.image}
                                alt="bsc"
                                width={32}
                                height={32}
                            />
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <span>Symbol:</span>
                            <span className="font-semibold">
                                {getProjectSymbol(project.symbol)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <span>Soft Cap:</span>
                            <span className="font-semibold">
                                {Number(project.soft_cap).toLocaleString('en')}{' '}
                                {tokens()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Hard Cap:</span>
                            <span className="font-semibold">
                                {Number(project.hard_cap).toLocaleString('en')}{' '}
                                {tokens()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {related.length > 0 && (
                <>
                    <div className="flex items-center justify-between mb-16 mt-28">
                        <h3 className="">Similar Projects</h3>
                    </div>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={{
                            576: {
                                slidesPerView: 2,
                            },
                            992: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                        }}
                        navigation
                        className="navigation-top item-shadow mb-[150px] -mt-[125px] category-slider"
                    >
                        {related.map((item, index) => (
                            <SwiperSlide key={index}>
                                <ProjectGridItem project={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}
        </div>
    );
};

ProjectPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default ProjectPage;
