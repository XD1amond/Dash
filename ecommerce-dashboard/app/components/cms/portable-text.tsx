"use client"

import { PortableText as SanityPortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '../../../sanity/lib/image'

// Helper function to safely get URL from the result of urlForImage
function getImageUrl(source: any): string {
  const imageObj = urlForImage(source);
  if (typeof imageObj.url === 'function') {
    return imageObj.url();
  }
  return imageObj.url || '';
}

interface PortableTextProps {
  value: any
}

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <div className="my-8 relative w-full h-auto">
          <Image
            src={getImageUrl(value)}
            alt={value.alt || 'Image'}
            width={800}
            height={500}
            className="rounded-lg object-cover"
          />
          {value.caption && (
            <div className="text-center text-sm text-gray-500 mt-2">
              {value.caption}
            </div>
          )}
        </div>
      )
    },
    callout: ({ value }: any) => {
      const typeStyles = {
        info: 'bg-blue-50 border-blue-500 text-blue-700',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
        error: 'bg-red-50 border-red-500 text-red-700',
        success: 'bg-green-50 border-green-500 text-green-700',
      }
      const type = value.type || 'info'
      
      return (
        <div className={`border-l-4 p-4 my-6 ${typeStyles[type as keyof typeof typeStyles]}`}>
          <p>{value.content}</p>
        </div>
      )
    },
    button: ({ value }: any) => {
      const styleMap = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      }
      const sizeMap = {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
      }
      
      const style = value.style || 'primary'
      const size = value.size || 'md'
      
      return (
        <Link 
          href={value.url || '#'} 
          className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${styleMap[style as keyof typeof styleMap]} ${sizeMap[size as keyof typeof sizeMap]} my-4`}
        >
          {value.text || 'Button'}
        </Link>
      )
    },
    codeBlock: ({ value }: any) => {
      return (
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto my-6">
          <code className="text-sm font-mono">
            {value.code}
          </code>
        </pre>
      )
    },
  },
  marks: {
    link: ({ value, children }: any) => {
      const target = (value?.blank === true) ? '_blank' : undefined
      return (
        <Link 
          href={value?.href || '#'} 
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:underline"
        >
          {children}
        </Link>
      )
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-bold mt-6 mb-4">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-xl font-bold mt-6 mb-4">{children}</h4>,
    normal: ({ children }: any) => <p className="mb-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
}

export function PortableText({ value }: PortableTextProps) {
  return <SanityPortableText value={value} components={components} />
}