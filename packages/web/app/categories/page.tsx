import { Separator } from '@/components/ui/separator';

const Categories = () => {
  return (
    <div className="space-y-4 sm:space-y-8">
      <h6 className="font-semibold text-lg">CURRENT</h6>
      <Separator />

      <h6 className="font-semibold text-lg">SUGGESTIONS</h6>
      <Separator />
    </div>
  );
};

export default Categories;
