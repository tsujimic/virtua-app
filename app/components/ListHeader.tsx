"use client";

type ListHeaderProps = {
  itemCount: number;
  onAddItems: () => void;
  onAddOneItem: () => void;
  onResetItems: () => void;
};

export function ListHeader({
  itemCount,
  onAddItems,
  onAddOneItem,
  onResetItems,
}: ListHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b p-2">
      <button
        type="button"
        onClick={onAddItems}
        className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
      >
        Add 10
      </button>
      <button
        type="button"
        onClick={onAddOneItem}
        className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Add 1
      </button>
      <button
        type="button"
        onClick={onResetItems}
        className="rounded bg-gray-700 px-3 py-1 text-sm font-medium text-white hover:bg-gray-800"
      >
        Reset
      </button>
      <span className="text-sm text-gray-600">Current: {itemCount} items</span>
    </div>
  );
}
