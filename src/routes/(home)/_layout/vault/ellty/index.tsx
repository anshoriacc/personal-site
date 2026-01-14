import { createFileRoute } from '@tanstack/react-router'
import { QuickFormStyling } from './-components/quick-form-styling'

export const Route = createFileRoute('/(home)/_layout/vault/ellty/')({
  component: ElltyPage,
})

function ElltyPage() {
  return (
    <main className="flex flex-1 flex-col space-y-12">
      <section className="flex flex-col space-y-6">
        <h2 className="font-medium">Quick Form Styling</h2>

        <QuickFormStyling />

        <div className="flex flex-col space-y-4">
          <h3>Explanation</h3>

          <div className="text-muted-foreground space-y-4 text-sm">
            <div className="space-y-2">
              <h4 className="text-foreground">Checkbox</h4>
              <ul className="space-y-2">
                <li>
                  State 1: not-checked default - border:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#CDCDCD] opacity-60" />
                  #CDCDCD 60%, check: none
                </li>
                <li>
                  State 2 & 8: not-checked & hover - border:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#BDBDBD]" />
                  #BDBDBD 100%, check:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#E3E3E3]" />
                  #E3E3E3
                </li>
                <li>
                  State 3: not-checked & active - border:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#BDBDBD]" />
                  #BDBDBD, outline:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#2469F6] opacity-10" />
                  #2469F6 3px, check: #878787
                </li>
                <li>
                  State 5: checked default - bg:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#2469F6]" />
                  #2469F6, border:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#2469F6]" />
                  #2469F6, check:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#FFFFFF]" />
                  #FFFFFF
                </li>
                <li>
                  State 4 & 6: checked & hover - bg:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#5087F8]" />
                  #5087F8, border:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#5087F8]" />
                  #5087F8, check:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#FFFFFF]" />
                  #FFFFFF
                </li>
                <li>
                  State 7: checked & active - bg:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#2469F6]" />
                  #2469F6, border:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#2469F6]" />
                  #2469F6, outline:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#2469F6] opacity-10" />
                  #2469F6 3px 10%, check:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#FFFFFF]" />
                  #FFFFFF
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-foreground">Button</h4>
              <ul className="space-y-2">
                <li>State 1: default - bg: #FFCE22</li>
                <li>State 2: hover - bg: #FFD84D</li>
                <li>State 3: active - bg: #FFCE22</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
