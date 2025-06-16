'use client'

import { useState, useRef, useEffect } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
}

interface MathButton {
  symbol: string
  latex: string
  insert: string
  category: 'number' | 'operation' | 'function' | 'symbol'
}

const mathButtons: MathButton[] = [
  // Numbers and basic operations
  { symbol: '7', latex: '7', insert: '7', category: 'number' },
  { symbol: '8', latex: '8', insert: '8', category: 'number' },
  { symbol: '9', latex: '9', insert: '9', category: 'number' },
  { symbol: '÷', latex: '\\div', insert: '/', category: 'operation' },
  { symbol: '4', latex: '4', insert: '4', category: 'number' },
  { symbol: '5', latex: '5', insert: '5', category: 'number' },
  { symbol: '6', latex: '6', insert: '6', category: 'number' },
  { symbol: '×', latex: '\\times', insert: '*', category: 'operation' },
  { symbol: '1', latex: '1', insert: '1', category: 'number' },
  { symbol: '2', latex: '2', insert: '2', category: 'number' },
  { symbol: '3', latex: '3', insert: '3', category: 'number' },
  { symbol: '−', latex: '-', insert: '-', category: 'operation' },
  { symbol: '0', latex: '0', insert: '0', category: 'number' },
  { symbol: '.', latex: '.', insert: '.', category: 'number' },
  { symbol: '=', latex: '=', insert: '=', category: 'operation' },
  { symbol: '+', latex: '+', insert: '+', category: 'operation' },
  
  // Functions and symbols
  { symbol: '√', latex: '\\sqrt{\\square}', insert: 'sqrt(', category: 'function' },
  { symbol: 'x²', latex: 'x^2', insert: '^2', category: 'function' },
  { symbol: 'xⁿ', latex: 'x^n', insert: '^', category: 'function' },
  { symbol: 'π', latex: '\\pi', insert: 'pi', category: 'symbol' },
  { symbol: '|x|', latex: '|x|', insert: 'abs(', category: 'function' },
  { symbol: '(', latex: '(', insert: '(', category: 'symbol' },
  { symbol: ')', latex: ')', insert: ')', category: 'symbol' },
  { symbol: '/', latex: '/', insert: '/', category: 'operation' },
  
  // Fractions and special
  { symbol: 'a/b', latex: '\\frac{a}{b}', insert: '/', category: 'function' },
  { symbol: '∛', latex: '\\sqrt[3]{\\square}', insert: 'cbrt(', category: 'function' },
  { symbol: 'log', latex: '\\log', insert: 'log(', category: 'function' },
  { symbol: 'sin', latex: '\\sin', insert: 'sin(', category: 'function' },
  { symbol: 'cos', latex: '\\cos', insert: 'cos(', category: 'function' },
  { symbol: '∞', latex: '\\infty', insert: 'infinity', category: 'symbol' },
  { symbol: '±', latex: '\\pm', insert: '±', category: 'symbol' },
  { symbol: '≈', latex: '\\approx', insert: '≈', category: 'symbol' },
]

export default function MathInput({ value, onChange, onSubmit, placeholder }: MathInputProps) {
  const [showKeypad, setShowKeypad] = useState(false)
  const [renderedMath, setRenderedMath] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)

  // Convert input to LaTeX for preview
  const convertToLatex = (input: string): string => {
    let latex = input
    // Convert common patterns to LaTeX
    latex = latex.replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}')
    latex = latex.replace(/cbrt\((.*?)\)/g, '\\sqrt[3]{$1}')
    latex = latex.replace(/abs\((.*?)\)/g, '|$1|')
    latex = latex.replace(/\^(-?\d+)/g, '^{$1}')
    latex = latex.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
    latex = latex.replace(/pi/g, '\\pi')
    latex = latex.replace(/infinity/g, '\\infty')
    latex = latex.replace(/\*/g, '\\times')
    latex = latex.replace(/÷/g, '\\div')
    return latex
  }

  useEffect(() => {
    try {
      const latex = convertToLatex(value)
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: false
      })
      setRenderedMath(html)
    } catch (e) {
      setRenderedMath(value)
    }
  }, [value])

  const insertAtCursor = (text: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0
      const end = inputRef.current.selectionEnd || 0
      const newValue = value.slice(0, start) + text + value.slice(end)
      onChange(newValue)
      
      // Set cursor position after the inserted text
      setTimeout(() => {
        if (inputRef.current) {
          const newPosition = start + text.length
          inputRef.current.setSelectionRange(newPosition, newPosition)
          inputRef.current.focus()
        }
      }, 0)
    }
  }

  const handleButtonClick = (button: MathButton) => {
    insertAtCursor(button.insert)
    
    // Add closing parenthesis for functions
    if (button.insert.endsWith('(')) {
      const start = inputRef.current?.selectionStart || 0
      const newValue = value.slice(0, start) + ')' + value.slice(start)
      onChange(newValue)
      // Keep cursor before the closing parenthesis
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(start, start)
          inputRef.current.focus()
        }
      }, 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit()
    }
  }

  return (
    <div className="relative">
      <div className="space-y-2">
        {/* Preview of rendered math */}
        {value && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Preview:</div>
            <div 
              className="text-lg"
              dangerouslySetInnerHTML={{ __html: renderedMath }}
            />
          </div>
        )}
        
        {/* Input field */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Enter your answer (use math buttons below)"}
            className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowKeypad(!showKeypad)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700"
            title="Toggle math keypad"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
              />
            </svg>
          </button>
        </div>

        {/* Math keypad */}
        {showKeypad && (
          <div className="mt-2 p-3 bg-white border rounded-lg shadow-lg">
            <div className="grid grid-cols-8 gap-1">
              {mathButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleButtonClick(button)}
                  className={`p-2 text-sm font-medium rounded hover:bg-gray-100 border ${
                    button.category === 'number' ? 'bg-gray-50' :
                    button.category === 'operation' ? 'bg-blue-50' :
                    button.category === 'function' ? 'bg-green-50' :
                    'bg-purple-50'
                  }`}
                  title={button.insert}
                >
                  <span dangerouslySetInnerHTML={{ 
                    __html: katex.renderToString(button.latex, { 
                      throwOnError: false,
                      displayMode: false 
                    }) 
                  }} />
                </button>
              ))}
            </div>
            
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  if (inputRef.current && value.length > 0) {
                    const pos = inputRef.current.selectionStart || 0
                    const newValue = value.slice(0, pos - 1) + value.slice(pos)
                    onChange(newValue)
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.setSelectionRange(pos - 1, pos - 1)
                        inputRef.current.focus()
                      }
                    }, 0)
                  }
                }}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                ← Delete
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-600">
              Tip: Click the calculator icon to hide/show this keypad
            </div>
          </div>
        )}
      </div>
    </div>
  )
}