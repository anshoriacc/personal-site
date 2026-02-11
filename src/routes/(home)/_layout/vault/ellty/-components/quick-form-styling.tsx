import React from 'react'
import { cn } from '@/lib/utils'

export const QuickFormStyling = () => {
  const [checkedPages, setCheckedPages] = React.useState<Array<boolean>>(
    Array(6).fill(false),
  )

  const allChecked = checkedPages.every((checked) => checked)

  const handleAllPagesChange = () => {
    setCheckedPages(Array(6).fill(!allChecked))
  }

  const handlePageChange = (index: number) => {
    setCheckedPages((prev) => {
      const newChecked = [...prev]
      newChecked[index] = !newChecked[index]
      return newChecked
    })
  }

  return (
    <div
      className={cn(
        "rounded-lg bg-white p-4 font-['Montserrat_Variable'] text-sm text-[#1F2128]",
        // possible repetitive styles
        // label styles
        '[&_label]:flex [&_label]:h-10.5 [&_label]:items-center [&_label]:justify-between [&_label]:gap-4 [&_label]:py-2 [&_label]:pr-3.75 [&_label]:pl-5.5 [&_label]:hover:cursor-pointer',
        // checkbox styles
        // state 1: not-checked default
        '[&_input[type="checkbox"]]:size-5.75 [&_input[type="checkbox"]]:appearance-none [&_input[type="checkbox"]]:rounded-[6px] [&_input[type="checkbox"]]:border [&_input[type="checkbox"]]:border-[#CDCDCD]/60 [&_input[type="checkbox"]]:bg-center [&_input[type="checkbox"]]:bg-no-repeat',
        // state 2 & 8: not-checked & hover
        '[&_input[type="checkbox"]:hover:not(:active)]:border-opacity-100 [&_input[type="checkbox"]:hover:not(:active)]:border-[#BDBDBD] [&_input[type="checkbox"]:hover:not(:active)]:bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2714%27%20height%3D%2710%27%20viewBox%3D%270%200%2014%2010%27%20fill%3D%27none%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M12.75%200.75L8.97857%204.52143L5.20714%208.29286L0.75%204.17857%27%20stroke%3D%27%23E3E3E3%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27%2F%3E%3C%2Fsvg%3E")]',
        // state 3: not-checked & active (clicked)
        '[&_input[type="checkbox"]:active]:border-[#BDBDBD] [&_input[type="checkbox"]:active]:bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2714%27%20height%3D%2710%27%20viewBox%3D%270%200%2014%2010%27%20fill%3D%27none%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M12.75%200.75L8.97857%204.52143L5.20714%208.29286L0.75%204.17857%27%20stroke%3D%27%23878787%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27%2F%3E%3C%2Fsvg%3E")] [&_input[type="checkbox"]:active]:outline-[3px] [&_input[type="checkbox"]:active]:outline-[#2469F6]/10',
        // state 5: checked default
        '[&_input[type="checkbox"]:checked]:border-[#2469F6] [&_input[type="checkbox"]:checked]:bg-[#2469F6] [&_input[type="checkbox"]:checked]:bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2714%27%20height%3D%2710%27%20viewBox%3D%270%200%2014%2010%27%20fill%3D%27none%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M12.75%200.75L8.97857%204.52143L5.20714%208.29286L0.75%204.17857%27%20stroke%3D%27white%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27%2F%3E%3C%2Fsvg%3E")]',
        // state 4 & 6: checked & hover
        '[&_input[type="checkbox"]:checked:hover:not(:active)]:border-[#5087F8] [&_input[type="checkbox"]:checked:hover:not(:active)]:bg-[#5087F8] [&_input[type="checkbox"]:checked:hover:not(:active)]:bg-[url("data:image/svg+xml,%3Csvg%20width%3D%2714%27%20height%3D%2710%27%20viewBox%3D%270%200%2014%2010%27%20fill%3D%27none%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M12.75%200.75L8.97857%204.52143L5.20714%208.29286L0.75%204.17857%27%20stroke%3D%27white%27%20stroke-width%3D%271.5%27%20stroke-linecap%3D%27round%27%2F%3E%3C%2Fsvg%3E")]',
        // state 7: checked & active (clicked)
        '[&_input[type="checkbox"]:checked:active]:outline-[3px] [&_input[type="checkbox"]:checked:active]:outline-[#2469F6]/10',
      )}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-92.5 rounded-sm bg-white py-2.5 shadow-[0px_8px_15px_0px_#1414141F,0px_0px_4px_0px_#1414141A]',
          'flex flex-col',
        )}
      >
        <label htmlFor="all-pages">
          All pages
          <div className="size-8.75 px-1.5 pt-[6.5px] pb-[5.5px]">
            <input
              type="checkbox"
              id="all-pages"
              checked={allChecked}
              onChange={handleAllPagesChange}
            />
          </div>
        </label>

        <div className="px-3.75 py-2.5">
          <div className="h-[0.7px] rounded-full bg-[#CDCDCD]" />
        </div>

        <div className="no-scrollbar flex h-42 flex-col overflow-y-scroll">
          {checkedPages.map((checked, index) => (
            <label key={index} htmlFor={`page-${index + 1}`}>
              Page {index + 1}
              <div className="size-8.75 px-1.5 pt-[6.5px] pb-[5.5px]">
                <input
                  type="checkbox"
                  id={`page-${index + 1}`}
                  checked={checked}
                  onChange={() => handlePageChange(index)}
                />
              </div>
            </label>
          ))}
        </div>

        <div className="px-3.75 py-2.5">
          <div className="h-[0.7px] rounded-full bg-[#CDCDCD]" />
        </div>
        <div className="px-3.75 py-2.5">
          <button className="w-full rounded-[4px] bg-[#FFCE22] px-5 py-2.5 not-active:cursor-pointer hover:bg-[#FFD84D] active:bg-[#FFCE22]">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
