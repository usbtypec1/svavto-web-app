export default defineEventHandler((event) => {
  const date = getRouterParam(event, 'date')

  return  {
    shifts: [
      {
        id: 1,
        performer: {
          id: 1234,
          full_name: "Antonio Banderas",
        },
      },
      {
        id: 1,
        performer: {
          id: 12314,
          full_name: "Antonio Banderas 1",
        },
      },
      {
        id: 1,
        performer: {
          id: 12345,
          full_name: "Antonio Banderas 2",
        },
      },
      {
        id: 1,
        performer: {
          id: 12346,
          full_name: "Antonio Banderas 3",
        },
      },
      {
        id: 1,
        performer: {
          id: 12374,
          full_name: "Antonio Banderas 4",
        },
      },
    ],
    date,
  }
})
