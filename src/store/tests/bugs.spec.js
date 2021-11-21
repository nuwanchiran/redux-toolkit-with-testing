import { addBug, addUserToBug, resolveBug, bugUnresolvedSelector, bugAssignedToUser, bugAssignedSelector, loadBugs } from '../bugs'
import MockAdapter from 'axios-mock-adapter'
import configureStore from '../index'
import axios from 'axios'

describe( "bugs slice", () =>
{
  let fakeAxios
  let store

  beforeEach( () =>
  {
    fakeAxios = new MockAdapter( axios )
    store = configureStore()
  } )

  const createState = () => ( {
    entities: {
      bugs: {
        list: [
          { id: 1, resolved: true },
          { id: 2, userId: 1 },
          { id: 3, userId: 1 },
          { id: 4 },
          { id: 5, userId: 2 }
        ]
      }
    }
  } )

  const bugSlice = () => store.getState().entities.bugs

  describe( "add bug", () =>
  {
    it( "should add the bug in the store if it saves in the server", async () =>
    {
      const BUG = { description: "test bug" }
      const SAVED_BUG = { ...BUG, id: 1 }
      fakeAxios.onPost( '/bugs' ).reply( 200, SAVED_BUG )

      await store.dispatch( addBug( BUG ) )

      expect( bugSlice().list ).toContainEqual( SAVED_BUG )
    } )

    it( "should not add the bug in the store if it's not saves in the server", async () =>
    {
      const BUG = { description: "test bug" }
      fakeAxios.onPost( '/bugs' ).reply( 500 )

      await store.dispatch( addBug( BUG ) )

      expect( bugSlice().list ).toHaveLength( 0 )
    } )
  } )

  describe( "resolve bug", () =>
  {
    it( "should resolve the bug in the store if it's updated in the server", async () =>
    {
      fakeAxios.onPost( '/bugs' ).reply( 200, { id: 1 } )
      fakeAxios.onPatch( '/bugs/1' ).reply( 200, { id: 1 } )

      await store.dispatch( addBug( {} ) )
      await store.dispatch( resolveBug( 1 ) )

      expect( bugSlice().list[0].resolved ).toBe( true )
    } )

    it( "should not resolve the bug in the store if there is no data in that id", async () =>
    {
      fakeAxios.onPost( '/bugs' ).reply( 500 )
      fakeAxios.onPatch( '/bugs/1' ).reply( 200, { id: 1 } )

      await store.dispatch( addBug( {} ) )
      await store.dispatch( resolveBug( 1 ) )

      expect( bugSlice().list ).toHaveLength( 0 )
    } )

    it( "should not resolve the bug in the store if it's not updated in the server", async () =>
    {
      fakeAxios.onPost( '/bugs' ).reply( 200, { id: 1 } )
      fakeAxios.onPatch( '/bugs/1' ).reply( 500 )

      await store.dispatch( addBug( {} ) )
      await store.dispatch( resolveBug( 1 ) )

      expect( bugSlice().list[0].resolved ).not.toBe( true )
    } )
  } )

  describe( "add user to bug", () =>
  {
    it( "should update the bug in the store if it's updated in the server", async () =>
    {
      fakeAxios.onPost( '/bugs' ).reply( 200, { id: 1 } )
      fakeAxios.onPatch( '/bugs/1' ).reply( 200, { id: 1, userId: 2 } )

      await store.dispatch( addBug( {} ) )
      await store.dispatch( addUserToBug( 1, 2 ) )

      expect( bugSlice().list[0].userId ).toBe( 2 )
    } )

    it( "should not update the bug in the store if there is no data in that id", async () =>
    {
      fakeAxios.onPost( '/bugs' ).reply( 500 )
      fakeAxios.onPatch( '/bugs/1' ).reply( 200, { id: 1, userId: 2 } )

      await store.dispatch( addBug( {} ) )
      await store.dispatch( addUserToBug( 1, 2 ) )

      expect( bugSlice().list ).toHaveLength( 0 )
    } )

    it( "should not update the bug in the store if it's not updated in the server", async () =>
    {
      fakeAxios.onPost( '/bugs' ).reply( 200, { id: 1, userId: 2 } )
      fakeAxios.onPatch( '/bugs/1' ).reply( 500 )

      await store.dispatch( addBug( {} ) )
      await store.dispatch( addUserToBug( 1, 2 ) )

      expect( bugSlice().list[0].resolved ).not.toBe( 2 )
    } )
  } )

  describe( 'loading bugs', () =>
  {
    describe( 'if the bug exist in the cache', () =>
    {
      it( 'should not be fetch from the server again', async () =>
      {
        fakeAxios.onGet( "/bugs" ).reply( 200, [{ id: 1 }] )

        await store.dispatch( loadBugs() )
        await store.dispatch( loadBugs() )

        // check request history
        expect( fakeAxios.history.get.length ).toBe( 1 )
      } )


    } )
    describe( 'if the bug does not exist in the cache', () =>
    {

      it( 'should be fetch from the server and put in the store', async () =>
      {
        fakeAxios.onGet( "/bugs" ).reply( 200, [{ id: 1 }] )

        await store.dispatch( loadBugs() )

        expect( bugSlice().list ).toHaveLength( 1 )
      } )

    } )

    describe( 'loading indicator', () =>
    {
      it( 'should be true while fetching the bug', () =>
      {
        // pass a function
        fakeAxios.onGet( "/bugs" ).reply( () =>
        {
          expect( bugSlice().loading ).toBe( true )
          return [200, [{ id: 1 }]]
        } )
      } )

      it( 'should be false after bugs are fetched', async () =>
      {
        fakeAxios.onGet( "/bugs" ).reply( 200, [{ id: 1 }] )

        await store.dispatch( loadBugs() )

        expect( bugSlice().loading ).toBe( false )
      } )

      it( 'should be false if the server returns an error', async () =>
      {
        fakeAxios.onGet( "/bugs" ).reply( 500 )

        await store.dispatch( loadBugs() )

        expect( bugSlice().loading ).toBe( false )
      } )

    } )


  } )


  describe( "selectors", () =>
  {
    it( "get unresolved bugs", () =>
    {
      const result = bugUnresolvedSelector( createState() )
      expect( result ).toHaveLength( 4 )
    } )

    it( "get assigned bugs", () =>
    {
      const result = bugAssignedSelector( createState() )
      expect( result ).toHaveLength( 3 )
    } )

    it( "get assigned bugs to user", () =>
    {
      const result = bugAssignedToUser( 2 )( createState() )
      expect( result ).toHaveLength( 1 )
    } )
  } )
} )
