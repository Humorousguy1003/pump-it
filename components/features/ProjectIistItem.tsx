/* eslint-disable @next/next/no-img-element */

import { ethers } from 'ethers';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import ALink from './ALink';

import { Project } from '~/types/projects';
import { getProjectStatus, getProjectSymbol } from '~/utils';
import { chainList } from '~/utils/constants';
import { useWeb3 } from '~/utils/web3';
import { launchpadAbi } from '~/utils/abis';

interface ProjectListItemProps {
    project: Project;
}

const ProjectListItem = ({ project }: ProjectListItemProps) => {
    const endDate = useMemo(() => {
        return moment(new Date(project.end_date as string));
    }, [project.end_date]);
    const { signer } = useWeb3();
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [contributors, setContributors] = useState(0);
    const chain = chainList.find((item) => item.id == project.chain_id);

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
        if (signer) {
            const contractInstance = new ethers.Contract(
                project.contractAddress,
                launchpadAbi.abi,
                signer
            );
            contractInstance.totalDeposits().then((res: string) => {
                setTotalDeposits(Number(ethers.utils.formatUnits(res, 18)));
            });

            contractInstance.contributors().then((res: string) => {
                setContributors(Number(ethers.utils.formatUnits(res, 18)));
            });
        }
    }, [signer]);

    return (
        <tr className="border-b border-veryLight">
            <td className="flex gap-3.5 py-5 px-4">
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
                    <h6 className="text-uppercase">
                        {getProjectSymbol(project.symbol)}
                    </h6>
                </div>
            </td>
            <td className="py-5 px-4">
                <span className="border border-veryLight px-3 py-1.5 whitespace-nowrap">
                    {getProjectStatus(project)}
                </span>
            </td>
            <td className="py-5 px-4">
                <span className="font-semibold text-base">{contributors}</span>
            </td>
            <td className="py-5 px-4">
                <span className="font-semibold text-base">
                    {totalDeposits.toLocaleString('en')} {tokens()}
                </span>
            </td>
            <td className="py-5 px-4 text-right">
                <div className="font-semibold text-base">
                    {endDate.format('MMM DD, YYYY')}
                </div>
                <h6 className="text-sm text-lightDark">
                    {endDate.format('HH:mm A')} - UTC
                </h6>
            </td>
            <td className="py-5 px-4">
                <img
                    src={chain?.image}
                    className="ml-auto"
                    alt="chain"
                    width={40}
                    height={40}
                />
            </td>
        </tr>
    );
};

export default ProjectListItem;
