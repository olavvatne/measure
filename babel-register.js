require('@babel/register')({
    cache: false,
    extensions: ['.js'],
    plugins: [
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
  });