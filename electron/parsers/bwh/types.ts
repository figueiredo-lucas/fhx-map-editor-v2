type LOD = {
  lod: number,
  blank: string
}

type Ogg = {
  name_length: number;
  name: string;
  unk: string;
  path_length: number;
  path: string;
};

type Dist = {
  min: number,
  max: number
}

type Field = {
  name: string,
  is_active: number,
  unk: string,
  day_fog: RGB,
  day_fog_dist: Dist,
  night_fog: RGB,
  night_fog_dist: Dist,
  original_heaven: RGB,
  night_heaven: RGB,
  day_heaven: RGB
}
