import { Check } from 'lucide-react';

export default function RecodeCheck({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl p-6 w-[85%] max-w-sm shadow-lg text-center">
    
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#BDBDBD] flex items-center justify-center">
          <Check color="white"></Check>
        </div>

    
        <h3 className="text-base font-semibold mb-2">
          오늘 제출하면, 더 이상 수정할 수 없어요!
        </h3>
        <p className="text-sm text-[#929292] mb-6">
          제출을 누르면 기록을 완료할게요
        </p>
        <button
          onClick={onConfirm}
          className="w-full py-3 rounded-xl text-white font-semibold
          bg-gradient-to-r from-[#7F6EDB] to-[#9F8CF3]"
        >
          제출
        </button>
      </div>
    </div>
  );
}