export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Yordam</h1>
      <div className="gildia-card space-y-4 p-6">
        <div>
          <h2 className="font-medium text-text-primary">Yangi tadbir qanday yaratiladi?</h2>
          <p className="mt-1 text-sm text-text-muted">
            Chap menyu → Yangi tadbir. 3 bosqichli wizard orqali ma&apos;lumotlarni kiriting.
          </p>
        </div>
        <div>
          <h2 className="font-medium text-text-primary">Shablonni qanday tahrirlash mumkin?</h2>
          <p className="mt-1 text-sm text-text-muted">
            Shablonlar bo&apos;limidan tanlang va muharrirda oching.
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
