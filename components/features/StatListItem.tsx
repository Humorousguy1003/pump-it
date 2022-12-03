/* eslint-disable @next/next/no-img-element */

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { Project } from '~/types/projects';
import { launchpadAbi } from '~/utils/abis';
import { chainList } from '~/utils/constants';
import { useWeb3 } from '~/utils/web3';
import ALink from './ALink';

interface StatListItemProps {
    project: Project;
    index: number;
}

const StatListItem = ({ project, index }: StatListItemProps) => {
    const { signer } = useWeb3();
    const [totalDeposits, setTotalDeposits] = useState(0);
    const chain = chainList.find((item) => item.id == project.chain_id);

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
        }
    }, [signer]);

    return (
        <tr className="">
            <td className="py-5 px-4">{index + 1}</td>
            <td className="py-5 px-4">
                <div className="flex items-center gap-4">
                    <ALink href={`/projects/${project.id}`}>
                        <img
                            src={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                '/storage/' +
                                project.logo
                            }
                            alt="user"
                            width={40}
                            height={40}
                        />
                    </ALink>
                    <div>
                        <ALink
                            href={`/projects/${project.id}`}
                            className="font-semibold text-base text-uppercase"
                        >
                            {project.name}
                        </ALink>
                    </div>
                </div>
            </td>
            <td className="py-5 px-4 text-left">
                <div className="gap-4 flex items-center justify-start">
                    <img
                        src={chain?.image}
                        alt="chain"
                        width={40}
                        height={40}
                    />
                    <span>{chain?.name}</span>
                </div>
            </td>
            <td className="py-5 px-4 text-right">
                <span className="font-semibold text-base">
                    {Number(project.hard_cap).toLocaleString('en')} BUSD
                </span>
            </td>
        </tr>
    );
};

export default StatListItem;
