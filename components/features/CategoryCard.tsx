/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { filterState } from '~/recoil/filters';
import { Category } from '~/types/projects';
import ALink from './ALink';

interface CategoryCardProps {
    category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
    const router = useRouter();
    const [filters, setFilters] = useRecoilState(filterState);

    const goToCategory = () => {
        setFilters({
            ...filters,
            categoryId: category.id,
        });
        router.push('/explore/grid');
    };

    return (
        <div className="flex flex-col items-center justify-center gap-5 rounded-xl bg-white p-8 category-card">
            <div className="flex items-center justify-center w-16 h-16 rounded-lg overflow-hidden bg-[#F5F5F5] transition">
                <img
                    src={
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                        '/storage/' +
                        category.image
                    }
                    alt="category"
                    width={32}
                    height={32}
                />
            </div>
            <button
                onClick={goToCategory}
                className="text-center text-xl font-semibold"
            >
                {category.name}
            </button>
        </div>
    );
};

export default CategoryCard;
