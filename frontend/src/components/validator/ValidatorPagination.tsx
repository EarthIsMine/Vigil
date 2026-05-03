interface Props {
  total: number;
  shown: number;
}

export default function ValidatorPagination({ total, shown }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
      <div className="text-sm text-[#8892ab]">
        {total > 0
          ? `Showing 1–${Math.min(shown, total)} of ${total.toLocaleString()} attacks`
          : 'No attacks detected yet'}
      </div>
    </div>
  );
}
