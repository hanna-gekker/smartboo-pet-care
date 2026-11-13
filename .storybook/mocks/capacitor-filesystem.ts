// Stand-in for @capacitor/filesystem in Storybook: the same calls, files kept in memory.
// Nothing is read from or written to the phone or the browser.

const files = new Map<string, string>()

export const Directory = { Data: 'DATA' } as const
export const Encoding = { UTF8: 'utf8' } as const

type FileOptions = { path: string; directory?: string }

export const Filesystem = {
  async readFile({ path }: FileOptions & { encoding?: string }) {
    const data = files.get(path)
    if (data === undefined) throw new Error('File does not exist')
    return { data }
  },
  async writeFile({ path, data }: FileOptions & { data: string; encoding?: string; recursive?: boolean }) {
    files.set(path, data)
    return { uri: path }
  },
  async deleteFile({ path }: FileOptions) {
    files.delete(path)
  },
}
