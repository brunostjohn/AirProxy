import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import NavBar from '../NavBar.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(NavBar, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
