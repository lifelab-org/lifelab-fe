import { Link } from "react-router-dom";

export default function Home() {
  const experiments = [
    { id: 1, title: "점심 후 15분 걷기", status: "실험이 완료되었어요! 결과를 확인해 보세요.", color: "bg-blue-100", dot: "bg-blue-300", dDay: "D-Day" }
  ];
  return (
    <div className="p-6">
      <div className="space-y-4">
        {experiments.map((exp) => (
          <Link 
            key={exp.id} 
            to="/record"
            className={`block border border-indigo-100 rounded-2xl p-5 ${exp.id === 1 ? 'bg-indigo-50/50' : 'bg-white shadow-sm'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}