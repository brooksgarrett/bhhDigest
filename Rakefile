desc "clean"
task :clean do
  rm_rf '*.crx'
end

desc "Package as CRX"
task :build do
  sh "crxmake --pack-extension=. --pack-extension-key=/home/brooks/.creds/pjhnipaedajgjcomomifdlfglnlbdeaa.pem"
end

