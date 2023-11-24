interface AlertProps {
  message: string;
}

export function Alert({ message }: AlertProps) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 py-3 rounded relative mb-2 text-center">
      <span className="sm:inline block">{message}</span>
    </div>
  );
}
