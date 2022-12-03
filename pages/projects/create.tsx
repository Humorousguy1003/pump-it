/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/router';
import {
    ChangeEvent,
    ReactElement,
    Suspense,
    useMemo,
    useRef,
    useState,
    useEffect,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';
import { useRecoilState, useRecoilValue } from 'recoil';

import ALink from '~/components/features/ALink';
import Fallback from '~/components/features/Fallback';
import Layout from '~/components/layouts/LayoutDefault';

import { createProjectState } from '~/recoil/projects';
import { Category, Project } from '~/types/projects';
import { createProject, uploadFile } from '~/api/projects';
import { chainList } from '~/utils/constants';
import { deployerAbi, decodeEvent } from '~/utils/abis';
import { isLoadingState, updateIDState } from '~/recoil/other';

import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { getAuthToken } from '~/utils';
import { useLazyLoading } from '~/utils/hooks';
import { useWeb3 } from '~/utils/web3';

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: '0267a87b8abb49379bf3a5b7c8e2f4d7', // required
        },
    },
};

const { SingleValue, Option } = components;

const IconSingleValue = (props: any) => (
    <SingleValue {...props} className="py-0.5 bg-white">
        <img
            src={props.data.image}
            alt="img"
            className="w-8 h-8 rounded-full inline-block mr-2"
        />
        {props.data.name}
    </SingleValue>
);

const IconOption = (props: any) => (
    <Option
        {...props}
        className="flex items-center justify-center bg-white h-12"
    >
        <img
            src={props.data.image}
            alt="img"
            className="w-8 h-8 rounded-full inline-block mr-2"
        />
        {props.data.name}
    </Option>
);

const CreateProjectPage = () => {
    const router = useRouter();
    const loading = useLazyLoading();

    // useEffect(() => {
    //     if (!getAuthToken()) router.push('/login');
    // }, []);

    if (loading) return <Fallback />;
    return (
        <Suspense fallback={<Fallback />}>
            <CreateProjectSection />
        </Suspense>
    );
};

const CreateProjectSection = () => {
    const [updateId, setUpdateIdState] = useRecoilState(updateIDState);
    const { categories } = useRecoilValue(createProjectState);
    const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
    const { connect, address, signer } = useWeb3();

    const router = useRouter();
    const refSelect1 = useRef(null);
    const refSelect2 = useRef(null);

    const {
        handleSubmit,
        register,
        getValues,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm<Project>({
        defaultValues: {
            name: '',
            symbol: '',
            tokenAddress: null,
            description: '',
            website: '',
            twitter: '',
            instagram: '',
            medium: '',
            telegram: '',
            start_date: null,
            end_date: null,
            lock_time: '',
            chain_id: null,
            soft_cap: '',
            hard_cap: '',
            equity_type: '',
            equity_value: null,
            category_id: null,
            logo: null,
            banner: null,
        },
    });

    const [logoImg, setLogoImg] = useState<string | null>(null);
    const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        files && files?.length > 0 && setLogoImg(URL.createObjectURL(files[0]));
    };
    const [dragActive, setDragActive] = useState(false);

    const convertDate = function (dateString: any) {
        var someDate = new Date(dateString);
        let newDate = someDate.getTime() / 1000;

        return newDate.toString();
    };

    const findUnit = () => {
        const find = chainList
            .find((c) => c.id == watch('chain_id'))
            ?.tokenList.find((item) => item.address === watch('tokenAddress'));
        if (find) {
            return find.name;
        } else null;
    };

    const handleCreateLaunchpad = async function (data: any) {
        try {
            let contract = new ethers.Contract(
                deployerAbi.address[56],
                deployerAbi.abi,
                signer
            );

            const {
                soft_cap,
                hard_cap,
                end_date,
                start_date,
                tokenAddress,
                name,
                symbol,
            } = data;

            console.log({ ...data }, 'data');
            let tx = await contract.createLaunchpad(
                [
                    ethers.utils.parseUnits(soft_cap, 18),
                    ethers.utils.parseUnits(hard_cap, 18),
                ],
                [convertDate(start_date), convertDate(end_date)],
                tokenAddress,
                name,
                symbol,
                { value: ethers.utils.parseUnits('0.01', 18) }
            );

            let receipt = await tx.wait();

            let contractAddress = decodeEvent(receipt);

            console.log({ receipt, contractAddress });

            return contractAddress;
        } catch (error) {
            console.log('createLauchpad error', error);
            toast.error('Errors found while sending transaction');
            return null;
        }
    };

    // handle drag events
    const handleDrag = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // triggers when file is dropped
    const handleDrop = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // handleFiles(e.dataTransfer.files);
            await handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files[0]) {
            await handleFile(files[0]);
        }
    };

    const handleFile = async (file: any) => {
        const formData = new FormData();
        formData.append('banner', file);
        await uploadFile(formData).then((res) => {
            toast.success('Image uploaded successfully.');
            setValue('banner', res);
        });
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        const submitData = {
            ...data,
            ...(data.website && {
                website: data.website.includes('http')
                    ? data.website
                    : 'https://' + data.website,
            }),
        };
        let newLaunchpad = await handleCreateLaunchpad(submitData);
        console.log('newlauchpad', newLaunchpad);

        if (!newLaunchpad) {
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        for (const key in data) {
            if (key !== 'logo') {
                formData.append(key, data[key]);
            }
        }

        if (!data['banner']) {
            formData.delete('banner');
        }

        formData.append('logo', data.logo[0]);
        formData.append('contractAddress', newLaunchpad);
        console.log('formData', formData);

        await createProject(formData)
            .then((res) => {
                toast.success('Project created successfully');
                setUpdateIdState(updateId + 1);
                setIsLoading(false);
                console.log(res);
                router.push(`/explore/list`);
            })
            .catch((err) => {
                setIsLoading(false);
                toast.error('Error occurs while creating projects');
            });
    };

    const cats = useMemo(() => {
        return categories.map((category: Category) => ({
            ...category,
            image:
                process.env.NEXT_PUBLIC_BACKEND_URL +
                '/storage/' +
                category.image,
        }));
    }, [categories]);

    return (
        <div className="xl:container container max-w-full mt-[60px] mb-[100px]">
            <h3 className="mb-[60px] text-center">Create Projects</h3>
            <div className="flex items-center justify-center gap-20">
                <span className="relative pb-4 text-xl font-semibold">
                    Startup
                    <span className="absolute left-0 right-0 bottom-0 h-[5px] bg-red rounded-t-full"></span>
                </span>
                <ALink
                    href="#"
                    className="pb-3 border-5 border-transparent text-xl font-semibold"
                >
                    NFT
                </ALink>
            </div>
            <hr className="border-veryLight mb-[60px]" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid lg:grid-cols-7 grid-cols-1 lg:gap-10 gap-8">
                    <div className="lg:col-span-4">
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Project Name <span className="text-red">*</span>
                            </label>
                            <input
                                type="text"
                                className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                {...register('name')}
                                required
                            />
                        </div>
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Symbol <span className="text-red">*</span>
                            </label>
                            <input
                                type="text"
                                className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                placeholder="Ex:$PumpIT"
                                {...register('symbol')}
                                required
                            />
                        </div>
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Category <span className="text-red">*</span>
                            </label>
                            <div ref={refSelect1} className="relative">
                                <Controller
                                    control={control}
                                    name="category_id"
                                    rules={{ required: true }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <Select
                                            placeholder="Select Option"
                                            classNamePrefix="custom-select"
                                            options={cats}
                                            components={{
                                                SingleValue: IconSingleValue,
                                                Option: IconOption,
                                            }}
                                            className="react-select bg-white"
                                            menuPortalTarget={
                                                refSelect1.current
                                            }
                                            styles={{
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    position: 'relative',
                                                    left: 0,
                                                    right: 0,
                                                    top: '100%',
                                                    backgroundColor: '#fff',
                                                    zIndex: 1000,
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    zIndex: '100 !important',
                                                    position: 'relative',
                                                    height: 'auto !important',
                                                }),
                                            }}
                                            value={cats.find(
                                                (c: {
                                                    id: number;
                                                    name: string;
                                                    image: string;
                                                }) => c.id === value
                                            )}
                                            onChange={(val) =>
                                                onChange(val?.id)
                                            }
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Description <span className="text-red">*</span>
                            </label>
                            <textarea
                                rows={6}
                                className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                placeholder="Add description"
                                {...register('description')}
                                required
                            />
                        </div>
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Website <span className="text-red">*</span>
                            </label>
                            <input
                                type="url"
                                className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                placeholder="Add link"
                                {...register('website')}
                                required
                            />
                        </div>
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Social Links
                            </label>
                            <div className="grid gap-y-3 px-4 py-3.5 border border-veryLight rounded-lg w-full text-sm overflow-hidden">
                                <div className="flex items-center">
                                    <img
                                        src="/create/discord.svg"
                                        className="mr-4"
                                        alt="discord"
                                        width={40}
                                        height={40}
                                    />
                                    <span className="opacity-40">
                                        https://discord.gg/
                                    </span>
                                    <input
                                        type="text"
                                        className="border-0 focus:border-0"
                                        {...register('discord')}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <img
                                        src="/create/twitter.svg"
                                        className="mr-4"
                                        alt="twitter"
                                        width={40}
                                        height={40}
                                    />
                                    <span className="opacity-40">
                                        https://twitter.com/
                                    </span>
                                    <input
                                        type="text"
                                        className="border-0 focus:border-0"
                                        {...register('twitter')}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <img
                                        src="/create/instagram.svg"
                                        className="mr-4"
                                        alt="instagram"
                                        width={40}
                                        height={40}
                                    />
                                    <span className="opacity-40">
                                        https://instagram.com/
                                    </span>
                                    <input
                                        type="text"
                                        className="border-0 focus:border-0"
                                        {...register('instagram')}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <img
                                        src="/create/mail.svg"
                                        className="mr-4"
                                        alt="medium"
                                        width={40}
                                        height={40}
                                    />
                                    <span className="opacity-40">
                                        https://medium.com/
                                    </span>
                                    <input
                                        type="text"
                                        className="border-0 focus:border-0"
                                        {...register('medium')}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <img
                                        src="/create/telegram.svg"
                                        className="mr-4"
                                        alt="telegram"
                                        width={40}
                                        height={40}
                                    />
                                    <span className="opacity-40">
                                        https://t.me/
                                    </span>
                                    <input
                                        type="text"
                                        className="border-0 focus:border-0"
                                        {...register('telegram')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="mb-8">
                                <label
                                    htmlFor=""
                                    className="font-semibold block text-sm mb-4"
                                >
                                    Start Date{' '}
                                    <span className="text-red">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                    placeholder="Select date"
                                    {...register('start_date')}
                                    required
                                />
                            </div>
                            <div className="mb-8">
                                <label
                                    htmlFor=""
                                    className="font-semibold block text-sm mb-4"
                                >
                                    End Date <span className="text-red">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                    placeholder="Select Date"
                                    {...register('end_date')}
                                    required
                                />
                            </div>
                            <div className="mb-8">
                                <label
                                    htmlFor=""
                                    className="font-semibold block text-sm mb-4"
                                >
                                    Lock time until (UTC)
                                    <span className="text-red">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                    {...register('lock_time')}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Chain <span className="text-red">*</span>
                            </label>
                            <div ref={refSelect2} className="relative">
                                <Controller
                                    control={control}
                                    name="chain_id"
                                    rules={{ required: true }}
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <Select
                                            placeholder="Select Option"
                                            classNamePrefix="custom-select"
                                            options={chainList}
                                            components={{
                                                SingleValue: IconSingleValue,
                                                Option: IconOption,
                                            }}
                                            menuPortalTarget={
                                                refSelect2.current
                                            }
                                            styles={{
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    position: 'relative',
                                                    left: 0,
                                                    right: 0,
                                                    top: '100%',
                                                    backgroundColor: '#fff',
                                                    zIndex: 1000,
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    zIndex: '100 !important',
                                                    position: 'relative',
                                                    height: 'auto !important',
                                                }),
                                            }}
                                            className="react-select"
                                            value={chainList.find(
                                                (c) => c.id === value
                                            )}
                                            onChange={(val) => {
                                                onChange(val?.id);
                                                chainList.find(
                                                    (c) =>
                                                        c.id ==
                                                        watch('chain_id')
                                                ) &&
                                                    setValue(
                                                        'tokenAddress',
                                                        chainList.find(
                                                            (c) =>
                                                                c.id ==
                                                                watch(
                                                                    'chain_id'
                                                                )
                                                        )!.tokenList[0].address
                                                    );
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Currency <span className="text-red">*</span>
                            </label>
                            <select
                                className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                {...register('tokenAddress', {
                                    required: true,
                                })}
                                required
                            >
                                {chainList
                                    .find((c) => c.id == watch('chain_id'))
                                    ?.tokenList.map(({ name, address }) => (
                                        <option value={address} key={name}>
                                            {name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="mb-8">
                                <label
                                    htmlFor=""
                                    className="font-semibold block text-sm mb-4"
                                >
                                    Soft Cap{' '}
                                    {findUnit() ? `(${findUnit()})` : ''}{' '}
                                    <span className="text-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                    placeholder="Enter amount"
                                    {...register('soft_cap')}
                                    required
                                />
                            </div>
                            <div className="mb-8">
                                <label
                                    htmlFor=""
                                    className="font-semibold block text-sm mb-4"
                                >
                                    Hard Cap{' '}
                                    {findUnit() ? `(${findUnit()})` : ''}{' '}
                                    <span className="text-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                    placeholder="Enter amount"
                                    {...register('hard_cap')}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Equity <span className="text-red">*</span>
                            </label>
                            <div className="flex gap-6 mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="radio"
                                        className="w-5"
                                        id="equity-mint"
                                        {...register('equity_type')}
                                        value="mint"
                                        required
                                    />
                                    <label htmlFor="equity-mint">Mint</label>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="radio"
                                        className="w-5"
                                        id="equity-allocation"
                                        {...register('equity_type')}
                                        value="allocation"
                                        required
                                    />
                                    <label htmlFor="equity-allocation">
                                        Allocation
                                    </label>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="radio"
                                        className="w-5"
                                        id="equity-both"
                                        value="both"
                                        {...register('equity_type')}
                                        required
                                    />
                                    <label htmlFor="equity-both">Both</label>
                                </div>
                            </div>
                            <input
                                type="text"
                                className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                                placeholder="value"
                                {...register('equity_value')}
                                required
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Project Logo <span className="text-red">*</span>
                            </label>

                            <div className="flex gap-5">
                                <input
                                    type="file"
                                    id="project-logo"
                                    className="hidden"
                                    {...register('logo', {
                                        onChange: onImageChange,
                                        required: true,
                                    })}
                                />
                                <label
                                    htmlFor="project-logo"
                                    className="flex items-center cursor-pointer justify-center w-12 h-12 rounded-lg bg-[#FAFAFA] overflow-hidden"
                                >
                                    <img
                                        className="object-cover"
                                        src={`${
                                            logoImg
                                                ? logoImg
                                                : '/create/logo-placeholder.svg'
                                        }`}
                                        alt="logo"
                                    />
                                </label>
                                <p className="text-sm">
                                    Upload an image.
                                    <br />
                                    Recommended size is 256x256 pixel.
                                </p>
                            </div>
                            {errors.logo && (
                                <p className="text-red text-xs mt-2">
                                    This field is required
                                </p>
                            )}
                        </div>
                        <div className="mb-8">
                            <label
                                htmlFor=""
                                className="font-semibold block text-sm mb-4"
                            >
                                Project Banner
                            </label>
                            <div
                                className="flex flex-col items-center justify-center gap-y-2 p-5 border border-dashed border-veryLight rounded-lg relative"
                                onDragEnter={handleDrag}
                            >
                                <h5 className="text-sm font-semibold">
                                    Drag and Drop file here
                                </h5>
                                <p className="text-xs text-lightDark">
                                    Files supported: PNG, JPEG, GIF
                                </p>
                                <input
                                    type="file"
                                    id="project-banner"
                                    className="hidden"
                                    onChange={handleChange}
                                />
                                <label
                                    className="text-xs rounded-full text-white bg-black py-3 px-4 font-semibold cursor-pointer"
                                    htmlFor="project-banner"
                                >
                                    Choose File
                                </label>
                                <p className="text-xs text-lightDark">
                                    Maximum Size: 5 Mb
                                </p>
                                {dragActive && (
                                    <div
                                        className="absolute top-0 right-0 bottom-0 left-0 border-2 border-dashed"
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    ></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center mt-6">
                    {address && (
                        <button
                            type="submit"
                            className="text-xs rounded-full text-white bg-black py-3 px-4 font-semibold cursor-pointer"
                        >
                            Create
                        </button>
                    )}
                    {!address && (
                        <button
                            onClick={() => connect && connect()}
                            type="button"
                            className="text-xs rounded-full text-white bg-black py-3 px-4 font-semibold cursor-pointer"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

CreateProjectPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

CreateProjectPage.authEnabled = true;

export default CreateProjectPage;
