/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { helpRequest } from '~/api/projects';

import ALink from '~/components/features/ALink';
import Layout from '~/components/layouts/LayoutDefault';
import { isLoadingState } from '~/recoil/other';

const HelpPage = () => {
    const {
        handleSubmit,
        register,
        getValues,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            subject: '',
            description: '',
            attachment: '',
        },
    });

    const [attachment, setAttachment] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
    const [dragActive, setDragActive] = useState(false);

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
        setValue('attachment', file);
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        console.log(data);
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        await helpRequest(formData)
            .then((res) => {
                toast.success('Help request is sent successfully');

                setIsLoading(false);
                console.log(res);
            })
            .catch((err) => {
                setIsLoading(false);
                toast.error('Error occurs while sending help request');
            });
    };

    return (
        <div className="xl:container container max-w-full mt-[60px] mb-[100px] flex justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-[660px]"
            >
                <h3 className="mb-[60px] text-center">Help Page</h3>
                <div className="mb-8">
                    <label
                        htmlFor=""
                        className="font-semibold block text-sm mb-4"
                    >
                        Your email address <span className="text-red">*</span>
                    </label>
                    <input
                        type="email"
                        className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                        {...register('email')}
                        required
                    />
                </div>
                <div className="mb-8">
                    <label
                        htmlFor=""
                        className="font-semibold block text-sm mb-4"
                    >
                        Subject <span className="text-red">*</span>
                    </label>
                    <input
                        type="text"
                        className="px-4 py-3.5 border border-veryLight rounded-lg w-full"
                        {...register('subject')}
                        required
                    />
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
                        {...register('description')}
                        required
                    />
                </div>
                <div className="mb-8">
                    <label
                        htmlFor=""
                        className="font-semibold block text-sm mb-4"
                    >
                        Attachment (optional)
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
                <button className="w-full rounded-full bg-red text-white py-4 font-bold mb-8">
                    Submit Request
                </button>
            </form>
        </div>
    );
};

HelpPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default HelpPage;
