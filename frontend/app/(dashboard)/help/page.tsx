export default function HelpPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Yordam</h1>
      <div className="gildia-card space-y-4 p-6">
        <div>
          <h2 className="font-medium text-text-primary">Yangi tadbir qanday yaratiladi?</h2>
          <p className="mt-1 text-sm text-text-muted">
            Chap menyu → Yangi tadbir. 6 bosqichli wizard: tadbir ma&apos;lumotlari, brending,
            materiallar, brending to&apos;plami, ko&apos;rib chiqish va ishga tushirish.
          </p>
        </div>
        <div>
          <h2 className="font-medium text-text-primary">Shablonni qanday tahrirlash mumkin?</h2>
          <p className="mt-1 text-sm text-text-muted">
            Avval tadbir yarating, Materiallar bo&apos;limidan shablon tanlang va muharrirda
            tahrirlang.
          </p>
        </div>
        <div>
          <h2 className="font-medium text-text-primary">Eksport formatlari</h2>
          <p className="mt-1 text-sm text-text-muted">PNG va PDF formatlarida yuklab olish mumkin.</p>
        </div>
      </div>
    </div>
  )
}
