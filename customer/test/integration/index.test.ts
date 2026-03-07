import { describe, expect, it } from "bun:test";

const should = '<integration> should'

describe('section', () => {
  it(`${should} just fail`, async () => {
    expect(false).toBeTrue()
  })
})

