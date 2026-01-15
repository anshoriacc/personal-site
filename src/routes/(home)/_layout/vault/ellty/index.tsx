import { createFileRoute } from '@tanstack/react-router'
import { QuickFormStyling } from './-components/quick-form-styling'
import { Container } from '@/components/motion-container'
import { Section } from '@/components/motion-section'

export const Route = createFileRoute('/(home)/_layout/vault/ellty/')({
  component: ElltyPage,
})

function ElltyPage() {
  return (
    <Container>
      <Section className="flex flex-col space-y-6">
        <h1 className="font-medium sm:text-lg">Quick Form Styling</h1>

        <QuickFormStyling />

        <div className="flex flex-col space-y-4">
          <h2 className="font-medium">Explanation</h2>

          <div className="text-muted-foreground space-y-4">
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
                <li>
                  State 1: default - bg:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#FFCE22]" />
                  #FFCE22
                </li>
                <li>
                  State 2: hover - bg:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#FFD84D]" />
                  #FFD84D
                </li>
                <li>
                  State 3: active - bg:{' '}
                  <span className="inline-block size-3 rounded-full bg-[#FFCE22]" />
                  #FFCE22
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  )
}
