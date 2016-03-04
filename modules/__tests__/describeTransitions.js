import assert from 'assert'
import expect from 'expect'
import { PUSH } from '../Actions'
import execSteps from './execSteps'

const describeTransitions = (createHistory) => {
  describe('a synchronous transition hook', () => {
    let history, unlisten, unlistenBefore
    beforeEach(() => {
      history = createHistory()
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('receives the next location', (done) => {
      const steps = [
        () => {
          history.push({
            pathname: '/home',
            search: '?the=query',
            state: { the: 'state' }
          })
        },
        (location) => {
          expect(nextLocation).toBe(location)
        }
      ]

      let nextLocation
      unlistenBefore = history.listenBefore((location) => {
        nextLocation = location
      })

      unlisten = history.listen(execSteps(steps, done))
    })
  })

  describe('an asynchronous transition hook', () => {
    let history, unlisten, unlistenBefore
    beforeEach(() => {
      history = createHistory()
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('receives the next location', (done) => {
      const steps = [
        () => {
          history.push({
            pathname: '/home',
            search: '?the=query',
            state: { the: 'state' }
          })
        },
        (location) => {
          expect(nextLocation).toBe(location)
        }
      ]

      let nextLocation
      unlistenBefore = history.listenBefore((location, callback) => {
        nextLocation = location
        setTimeout(callback)
      })

      unlisten = history.listen(execSteps(steps, done))
    })
  })

  describe('when the user confirms a transition', () => {
    let confirmationMessage, location, history, unlisten, unlistenBefore
    beforeEach(() => {
      location = null
      confirmationMessage = 'Are you sure?'

      history = createHistory({
        getUserConfirmation(message, callback) {
          expect(message).toBe(confirmationMessage)
          callback(true)
        }
      })

      unlistenBefore = history.listenBefore(() => {
        return confirmationMessage
      })

      unlisten = history.listen((loc) => {
        location = loc
      })
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('updates the location', () => {
      const prevLocation = location
      history.push({
        pathname: '/home',
        search: '?the=query',
        state: { the: 'state' }
      })
      expect(prevLocation).toNotBe(location)

      assert(location)
      expect(location.pathname).toEqual('/home')
      expect(location.search).toEqual('?the=query')
      expect(location.state).toEqual({ the: 'state' })
      expect(location.action).toEqual(PUSH)
      assert(location.key)
    })
  })

  describe('when the user cancels a transition', () => {
    let confirmationMessage, location, history, unlisten, unlistenBefore
    beforeEach(() => {
      location = null
      confirmationMessage = 'Are you sure?'

      history = createHistory({
        getUserConfirmation(message, callback) {
          expect(message).toBe(confirmationMessage)
          callback(false)
        }
      })

      unlistenBefore = history.listenBefore(() => {
        return confirmationMessage
      })

      unlisten = history.listen((loc) => {
        location = loc
      })
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('does not update the location', () => {
      const prevLocation = location
      history.push('/home')
      expect(prevLocation).toBe(location)
    })
  })

  describe('when the transition hook cancels a transition', () => {
    let location, history, unlisten, unlistenBefore
    beforeEach(() => {
      location = null

      history = createHistory()

      unlistenBefore = history.listenBefore(() => {
        return false
      })

      unlisten = history.listen((loc) => {
        location = loc
      })
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('does not update the location', () => {
      const prevLocation = location
      history.push('/home')
      expect(prevLocation).toBe(location)
    })
  })
}

export default describeTransitions
