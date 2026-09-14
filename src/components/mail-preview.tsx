export const MailPreview = ({ email }: { email: string }) => {
  return (
    <div className="grid gap-1 select-none">
      <div className="px-1">
        <p className="text-muted-foreground">Mail me</p>
      </div>
      <div className="ring-foreground/10 bg-background rounded-md p-1 ring-1">
        <p className="px-1 select-all">{email}</p>
      </div>
    </div>
  )
}
