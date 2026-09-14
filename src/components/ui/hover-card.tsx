import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card'
import { cn } from 'cn'

function HoverCard<Payload>({
  ...props
}: PreviewCardPrimitive.Root.Props<Payload>) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger<Payload>({
  ...props
}: PreviewCardPrimitive.Trigger.Props<Payload>) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardViewport({
  className,
  ...props
}: PreviewCardPrimitive.Viewport.Props) {
  return (
    <PreviewCardPrimitive.Viewport
      data-slot="hover-card-viewport"
      className={cn(
        'relative size-full overflow-clip',
        '**:data-current:box-border **:data-current:w-(--popup-width) **:data-current:translate-x-0 **:data-current:p-1 **:data-current:opacity-100 **:data-current:blur-none **:data-current:transition-[translate,opacity,filter] **:data-current:duration-200 **:data-current:ease-[cubic-bezier(0.23,1,0.32,1)]',
        '**:data-previous:box-border **:data-previous:w-(--popup-width) **:data-previous:translate-x-0 **:data-previous:p-1 **:data-previous:opacity-100 **:data-previous:blur-none **:data-previous:transition-[translate,opacity,filter] **:data-previous:duration-200 **:data-previous:ease-[cubic-bezier(0.23,1,0.32,1)]',
        '[&_[data-current][data-starting-style]]:blur-xs [&_[data-previous][data-ending-style]]:blur-xs',
        'motion-reduce:**:data-current:translate-x-0! motion-reduce:**:data-current:blur-none! motion-reduce:**:data-previous:translate-x-0! motion-reduce:**:data-previous:blur-none!',
        "[&[data-activation-direction~='left']_[data-current][data-starting-style]]:translate-x-[-30%] [&[data-activation-direction~='left']_[data-current][data-starting-style]]:opacity-0 [&[data-activation-direction~='left']_[data-previous][data-ending-style]]:translate-x-[30%] [&[data-activation-direction~='left']_[data-previous][data-ending-style]]:opacity-0 [&[data-activation-direction~='right']_[data-current][data-starting-style]]:translate-x-[30%] [&[data-activation-direction~='right']_[data-current][data-starting-style]]:opacity-0 [&[data-activation-direction~='right']_[data-previous][data-ending-style]]:translate-x-[-30%] [&[data-activation-direction~='right']_[data-previous][data-ending-style]]:opacity-0",
        className,
      )}
      {...props}
    />
  )
}

function HoverCardContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            'bg-popover text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 relative z-50 h-(--popup-height,auto) w-(--popup-width,auto) origin-(--transform-origin) rounded-lg text-sm shadow-md ring-1 outline-hidden transition-[width,height,opacity,transform] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none',
            className,
          )}
          {...props}
        >
          <HoverCardViewport>{children}</HoverCardViewport>
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardViewport }
